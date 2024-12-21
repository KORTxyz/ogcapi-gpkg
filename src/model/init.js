import GeoPackageGeometryData from '@ngageoint/geopackage'
import Database from 'better-sqlite3';

const initDb = async (databasePath) => {
    const db = new Database(databasePath, { fileMustExist: true });
    
    process.on('exit', () => db.close());
    process.on('SIGHUP', () => process.exit(128 + 1));
    process.on('SIGINT', () => process.exit(128 + 2));
    process.on('SIGTERM', () => process.exit(128 + 15));

    db.function('ST_IsEmpty', (geom) => geom === null ? 1 : 0);
    db.function('ST_MinX', (geom) => new GeoPackageGeometryData(geom).buildEnvelope()._minX);
    db.function('ST_MinY', (geom) => new GeoPackageGeometryData(geom).buildEnvelope()._minY);
    db.function('ST_MaxX', (geom) => new GeoPackageGeometryData(geom).buildEnvelope()._maxX);
    db.function('ST_MaxY', (geom) => new GeoPackageGeometryData(geom).buildEnvelope()._maxY);

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
            Select 'gpkgext_stylesheets', 'gpkg_portrayal', 'https://gitlab.com/imagemattersllc/ogc-tb-16-gpkg/-/blob/master/extensions/5-portrayal.adoc','read-write' Where not exists(select * from gpkg_extensions where table_name='gpkgext_stylesheets');

        CREATE TABLE if not exists gpkgext_stylesheets (
            id INTEGER PRIMARY KEY,
            style_id INTEGER NOT NULL,
            format TEXT NOT NULL,
            stylesheet TEXT NOT NULL
        );
    `;

    db.exec(sql);

    return db;
}


export {
    initDb
}