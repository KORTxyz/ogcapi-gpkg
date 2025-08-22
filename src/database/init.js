import Database from 'better-sqlite3';
import { GeometryReader } from '@ngageoint/simple-features-wkb-js';

const initDb = async (databasePath) => {
    const db = new Database(databasePath, { fileMustExist: true });
    
    process.on('exit', () => db.close());
    process.on('SIGHUP', () => process.exit(128 + 1));
    process.on('SIGINT', () => process.exit(128 + 2));
    process.on('SIGTERM', () => process.exit(128 + 15));

    db.function('ST_IsEmpty', (geom) => geom === null ? 1 : 0);
    db.function('ST_MinX', (geom) => GeometryReader.readGeometry(geom.slice(40)).getEnvelope()._minX);
    db.function('ST_MinY', (geom) => GeometryReader.readGeometry(geom.slice(40)).getEnvelope()._minY);
    db.function('ST_MaxX', (geom) => GeometryReader.readGeometry(geom.slice(40)).getEnvelope()._maxX);
    db.function('ST_MaxY', (geom) => GeometryReader.readGeometry(geom.slice(40)).getEnvelope()._maxY);

    db.pragma('journal_mode = WAL');

    const sql = `
        INSERT INTO gpkg_extensions (table_name, extension_name, definition, scope)
            Select 'gpkgext_styles', 'gpkg_portrayal', 'https://gitlab.com/imagemattersllc/ogc-tb-16-gpkg/-/blob/master/extensions/5-portrayal.adoc','read-write' Where not exists(select * from gpkg_extensions where table_name='gpkgext_styles');

        CREATE TABLE if not exists gpkgext_styles (
            id INTEGER PRIMARY KEY,
            style TEXT NOT NULL,
            description TEXT,
            uri TEXT
        );

        INSERT INTO gpkg_extensions (table_name, extension_name, definition, scope)
            Select 'gpkgext_symbols', 'gpkg_portrayal', 'https://gitlab.com/imagemattersllc/ogc-tb-16-gpkg/-/blob/master/extensions/5-portrayal.adoc','read-write' Where not exists(select * from gpkg_extensions where table_name='gpkgext_symbols');

        CREATE TABLE if not exists gpkgext_symbols (
            id INTEGER PRIMARY KEY,
            symbol TEXT NOT NULL,
            description TEXT,
            uri TEXT
        );

        INSERT INTO gpkg_extensions (table_name, extension_name, definition, scope)
            Select 'gpkgext_stylesheets', 'gpkg_portrayal', 'https://gitlab.com/imagemattersllc/ogc-tb-16-gpkg/-/blob/master/extensions/5-portrayal.adoc','read-write' Where not exists(select * from gpkg_extensions where table_name='gpkgext_stylesheets');

        CREATE TABLE if not exists gpkgext_stylesheets (
            id INTEGER PRIMARY KEY,
            style_id INTEGER NOT NULL,
            format TEXT NOT NULL,
            stylesheet TEXT NOT NULL
        );

        INSERT INTO gpkg_extensions (table_name, extension_name, definition, scope)
            Select 'gpkgext_symbol_images', 'gpkg_portrayal', 'https://gitlab.com/imagemattersllc/ogc-tb-16-gpkg/-/blob/master/extensions/5-portrayal.adoc','read-write' Where not exists(select * from gpkg_extensions where table_name='gpkgext_stylesheets');

        CREATE TABLE if not exists gpkgext_symbol_images (
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

        CREATE TABLE if not exists gpkgext_symbol_content (
            id INTEGER PRIMARY KEY,
            format TEXT NOT NULL,
            content BLOB NOT NULL,
            uri TEXT
        );
    `;

    db.exec(sql);

    return db;
}


export {
    initDb
}