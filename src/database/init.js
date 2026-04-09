import Database from 'better-sqlite3';
import { GeometryReader } from '@ngageoint/simple-features-wkb-js';

const openDatabases = new Set();
process.on('exit', () => {
    for (const db of openDatabases) {
        if (db.open) db.close();
    }
});

const startUp = db => {
    db.function('ST_IsEmpty', (geom) => geom === null ? 1 : 0);
    db.function('ST_MinX', (geom) => GeometryReader.readGeometry(geom.slice(40)).getEnvelope()._minX);
    db.function('ST_MinY', (geom) => GeometryReader.readGeometry(geom.slice(40)).getEnvelope()._minY);
    db.function('ST_MaxX', (geom) => GeometryReader.readGeometry(geom.slice(40)).getEnvelope()._maxX);
    db.function('ST_MaxY', (geom) => GeometryReader.readGeometry(geom.slice(40)).getEnvelope()._maxY);

    db.pragma('journal_mode = WAL');
}

const createNecessaryTables = db => {

    db.exec(`
        CREATE TABLE IF NOT EXISTS gpkg_extensions (
            table_name TEXT,
            column_name TEXT,
            extension_name TEXT NOT NULL,
            definition TEXT NOT NULL,
            scope TEXT NOT NULL,
            CONSTRAINT ge_tce UNIQUE (table_name, column_name, extension_name)
        );
        INSERT INTO gpkg_extensions (table_name, extension_name, definition, scope)
            Select 'gpkgext_styles', 'gpkg_portrayal', 'https://gitlab.com/imagemattersllc/ogc-tb-16-gpkg/-/blob/master/extensions/5-portrayal.adoc','read-write' Where not exists(select * from gpkg_extensions where table_name='gpkgext_styles');

        CREATE TABLE IF NOT EXISTS gpkgext_styles (
            id INTEGER PRIMARY KEY,
            style TEXT NOT NULL,
            description TEXT,
            uri TEXT
        );

        INSERT INTO gpkg_extensions (table_name, extension_name, definition, scope)
            Select 'gpkgext_symbols', 'gpkg_portrayal', 'https://gitlab.com/imagemattersllc/ogc-tb-16-gpkg/-/blob/master/extensions/5-portrayal.adoc','read-write' Where not exists(select * from gpkg_extensions where table_name='gpkgext_symbols');

        CREATE TABLE IF NOT EXISTS gpkgext_symbols (
            id INTEGER PRIMARY KEY,
            symbol TEXT NOT NULL,
            description TEXT,
            uri TEXT
        );

        INSERT INTO gpkg_extensions (table_name, extension_name, definition, scope)
            Select 'gpkgext_stylesheets', 'gpkg_portrayal', 'https://gitlab.com/imagemattersllc/ogc-tb-16-gpkg/-/blob/master/extensions/5-portrayal.adoc','read-write' Where not exists(select * from gpkg_extensions where table_name='gpkgext_stylesheets');

        CREATE TABLE IF NOT EXISTS gpkgext_stylesheets (
            id INTEGER PRIMARY KEY,
            style_id INTEGER NOT NULL,
            format TEXT NOT NULL,
            stylesheet TEXT NOT NULL
        );

        INSERT INTO gpkg_extensions (table_name, extension_name, definition, scope)
            Select 'gpkgext_symbol_images', 'gpkg_portrayal', 'https://gitlab.com/imagemattersllc/ogc-tb-16-gpkg/-/blob/master/extensions/5-portrayal.adoc','read-write' Where not exists(select * from gpkg_extensions where table_name='gpkgext_stylesheets');

        CREATE TABLE IF NOT EXISTS gpkgext_symbol_images (
            id INTEGER PRIMARY KEY,
            symbol_id INTEGER NOT NULL,
            content_id INTEGER NOT NULL,
            width INTEGER,
            height  INTEGER,
            offset_x INTEGER,
            offset_y INTEGER,
            pixel_ratio INTEGER
        );

        INSERT INTO gpkg_extensions (table_name, extension_name, definition, scope)
            Select 'gpkgext_symbol_content', 'gpkg_portrayal', 'https://gitlab.com/imagemattersllc/ogc-tb-16-gpkg/-/blob/master/extensions/5-portrayal.adoc','read-write' Where not exists(select * from gpkg_extensions where table_name='gpkgext_stylesheets');

        CREATE TABLE IF NOT EXISTS gpkgext_symbol_content (
            id INTEGER PRIMARY KEY,
            format TEXT NOT NULL,
            content BLOB NOT NULL,
            uri TEXT
        );

        INSERT INTO gpkg_extensions ( extension_name, definition, scope)
            SELECT 'gpkg_metadata','http://www.geopackage.org/spec/#extension_metadata','read-write' WHERE NOT EXISTS (select * from gpkg_extensions where extension_name='gpkg_metadata');
       
        CREATE TABLE IF NOT EXISTS gpkg_metadata (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            md_scope TEXT NOT NULL DEFAULT 'dataset',
            md_standard_uri TEXT NOT NULL,
            mime_type TEXT NOT NULL DEFAULT 'text/xml',
            metadata TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS gpkg_metadata_reference (
            reference_scope TEXT NOT NULL,
            table_name TEXT,
            column_name TEXT,
            row_id_value INTEGER,
            timestamp DATETIME NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
            md_file_id INTEGER NOT NULL,
            md_parent_id INTEGER,
            FOREIGN KEY (md_file_id) REFERENCES gpkg_metadata(id),
            FOREIGN KEY (md_parent_id) REFERENCES gpkg_metadata(id)
        );

        INSERT INTO gpkg_extensions (table_name, extension_name, definition, scope)
            SELECT 'gpkgext_relations', 'gpkg_related_tables', 'http://www.opengis.net/doc/IS/gpkg-rte/1.0', 'read-write'
            WHERE NOT EXISTS (SELECT * FROM gpkg_extensions WHERE table_name='gpkgext_relations');

        CREATE TABLE IF NOT EXISTS gpkgext_relations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            base_table_name TEXT NOT NULL,
            base_primary_column TEXT NOT NULL DEFAULT 'id',
            related_table_name TEXT NOT NULL,
            related_primary_column TEXT NOT NULL DEFAULT 'id',
            relation_name TEXT NOT NULL,
            mapping_table_name TEXT NOT NULL UNIQUE
        );

        CREATE TABLE IF NOT EXISTS metadata_media (
            base_id INTEGER NOT NULL,
            related_id INTEGER NOT NULL
        );

        INSERT INTO gpkgext_relations (base_table_name, base_primary_column, related_table_name, related_primary_column, relation_name, mapping_table_name)
            SELECT 'gpkg_metadata', 'id', 'gpkgext_symbols', 'id', 'media', 'metadata_media'
            WHERE NOT EXISTS (SELECT * FROM gpkgext_relations WHERE mapping_table_name='metadata_media');

        UPDATE gpkgext_relations SET related_table_name = 'gpkgext_symbols'
            WHERE mapping_table_name = 'metadata_media' AND related_table_name != 'gpkgext_symbols';
    `);
}

const addMetadata = (db, metadata) => {
    const insert = db.transaction((meta) => {
        const { lastInsertRowid: mdFileId } = db.prepare(`
            INSERT INTO gpkg_metadata (md_scope, md_standard_uri, mime_type, metadata)
            VALUES ('dataset', 'https://kort.xyz/metadata', 'application/json', ?)
        `).run(Buffer.from(JSON.stringify(meta)));

        db.prepare(`
            INSERT INTO gpkg_metadata_reference (reference_scope, md_file_id)
            VALUES ('geopackage',?)
        `).run(mdFileId);
    });

    insert(metadata);
}

const getMetadata = db => {
    const row = db.prepare(`
       SELECT metadata, md_standard_uri as standard
       FROM gpkg_metadata m
       JOIN gpkg_metadata_reference r
       ON m.id = r.md_file_id
       WHERE r.reference_scope = 'geopackage'
       LIMIT 1;
    `).get();
    if(!row || row.standard != "https://kort.xyz/metadata") return;

    return JSON.parse(row.metadata.toString());
}

const addThumbnail = (db, resourceId) => {
    const update = db.transaction(() => {
        const metaRow = db.prepare(`
            SELECT m.id
            FROM gpkg_metadata m
            JOIN gpkg_metadata_reference r ON m.id = r.md_file_id
            WHERE r.reference_scope = 'geopackage' AND m.md_standard_uri = 'https://kort.xyz/metadata'
            LIMIT 1
        `).get();
        if (!metaRow) return;

        const symbolRow = db.prepare('SELECT id FROM gpkgext_symbols WHERE symbol = ?').get(resourceId);
        if (!symbolRow) return;

        // Remove existing thumbnail mapping
        db.prepare('DELETE FROM metadata_media WHERE base_id = ?').run(metaRow.id);

        db.prepare(`
            INSERT INTO metadata_media (base_id, related_id) VALUES (?, ?)
        `).run(metaRow.id, symbolRow.id);
    });

    update();
}

const getThumbnail = db => {
    const row = db.prepare(`
        SELECT s.symbol
        FROM gpkgext_symbols s
        JOIN metadata_media mm ON s.id = mm.related_id
        JOIN gpkg_metadata m ON m.id = mm.base_id
        JOIN gpkg_metadata_reference r ON m.id = r.md_file_id
        WHERE r.reference_scope = 'geopackage'
          AND m.md_standard_uri = 'https://kort.xyz/metadata'
        LIMIT 1
    `).get();
    if (!row) return;

    return row.symbol;
}

const updateMetadata = (db, metadata) => {
    const update = db.transaction((meta) => {
        const row = db.prepare(`
            SELECT m.id
            FROM gpkg_metadata m
            JOIN gpkg_metadata_reference r ON m.id = r.md_file_id
            WHERE r.reference_scope = 'geopackage' AND m.md_standard_uri = 'https://kort.xyz/metadata'
            LIMIT 1
        `).get();

        if (row) {
            db.prepare(`UPDATE gpkg_metadata SET metadata = ? WHERE id = ?`)
                .run(Buffer.from(JSON.stringify(meta)), row.id);
        } else {
            addMetadata(db, meta);
        }
    });

    update(metadata);
}

const initDb = async (databasePath,initialMetadata) => {
    console.log("Reading:", databasePath)
    const db = new Database(databasePath, { fileMustExist: true });
    openDatabases.add(db);

    startUp(db)
    createNecessaryTables(db)

    if(initialMetadata) addMetadata(db, initialMetadata);
    const metadata = getMetadata(db) || {};
    metadata.thumbnail = getThumbnail(db);

    return { db, metadata };
}


export {
    initDb,
    openDatabases,
    addThumbnail,
    getThumbnail,
    updateMetadata
}