const fs = require('fs');
const {default:bbox} = require('@turf/bbox')
const { GeoPackageGeometryData } = require('@ngageoint/geopackage');
const { FeatureConverter } = require('@ngageoint/simple-features-geojson-js')


module.exports = {
    init: (databasePath) => {
        const exists = fs.existsSync(databasePath)

        globalThis.db = require('better-sqlite3')(databasePath, { fileMustExist: true });
        db.pragma('journal_mode = WAL');

        db.function('ST_IsEmpty', (geom) => geom === null ? 1 : 0 );
        db.function('ST_MinX', (geom) => bbox(FeatureConverter.toFeatureGeometry(new GeoPackageGeometryData(geom).getGeometry()))[0]);
        db.function('ST_MinY', (geom) => bbox(FeatureConverter.toFeatureGeometry(new GeoPackageGeometryData(geom).getGeometry()))[1]);
        db.function('ST_MaxX', (geom) => bbox(FeatureConverter.toFeatureGeometry(new GeoPackageGeometryData(geom).getGeometry()))[2]);
        db.function('ST_MaxY', (geom) => bbox(FeatureConverter.toFeatureGeometry(new GeoPackageGeometryData(geom).getGeometry()))[3]);

        if (!exists) {

            db.exec(`
            CREATE TABLE gpkg_contents (
              table_name TEXT NOT NULL PRIMARY KEY,
              data_type TEXT NOT NULL,
              identifier TEXT UNIQUE,
              description TEXT DEFAULT '',
              last_change DATETIME NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
              min_x DOUBLE,
              min_y DOUBLE,
              max_x DOUBLE,
              max_y DOUBLE,
              srs_id INTEGER,
              CONSTRAINT fk_gc_r_srs_id FOREIGN KEY (srs_id) REFERENCES gpkg_spatial_ref_sys(srs_id)
            );
          
            CREATE TABLE gpkg_extensions ( table_name TEXT, column_name TEXT, extension_name TEXT NOT NULL, definition TEXT NOT NULL, scope TEXT NOT NULL, CONSTRAINT ge_tce UNIQUE (table_name, column_name, extension_name) );
          
            CREATE TABLE gpkg_geometry_columns ( table_name TEXT NOT NULL, column_name TEXT NOT NULL, geometry_type_name TEXT NOT NULL, srs_id INTEGER NOT NULL, z TINYINT NOT NULL, m TINYINT NOT NULL, CONSTRAINT pk_geom_cols PRIMARY KEY (table_name, column_name), CONSTRAINT fk_gc_tn FOREIGN KEY (table_name) REFERENCES gpkg_contents(table_name), CONSTRAINT fk_gc_srs FOREIGN KEY (srs_id) REFERENCES gpkg_spatial_ref_sys (srs_id) );
            
            CREATE TABLE gpkg_tile_matrix ( table_name TEXT NOT NULL, zoom_level INTEGER NOT NULL, matrix_width INTEGER NOT NULL, matrix_height INTEGER NOT NULL, tile_width INTEGER NOT NULL, tile_height INTEGER NOT NULL, pixel_x_size DOUBLE NOT NULL, pixel_y_size DOUBLE NOT NULL, CONSTRAINT pk_ttm PRIMARY KEY (table_name, zoom_level), CONSTRAINT fk_tmm_table_name FOREIGN KEY (table_name) REFERENCES gpkg_contents(table_name) );
            
            CREATE TABLE gpkg_tile_matrix_set ( table_name TEXT NOT NULL PRIMARY KEY, srs_id INTEGER NOT NULL, min_x DOUBLE NOT NULL, min_y DOUBLE NOT NULL, max_x DOUBLE NOT NULL, max_y DOUBLE NOT NULL, CONSTRAINT fk_gtms_table_name FOREIGN KEY (table_name) REFERENCES gpkg_contents(table_name), CONSTRAINT fk_gtms_srs FOREIGN KEY (srs_id) REFERENCES gpkg_spatial_ref_sys (srs_id) );
            
            CREATE TABLE gpkg_spatial_ref_sys ( srs_name TEXT NOT NULL, srs_id INTEGER NOT NULL PRIMARY KEY, organization TEXT NOT NULL, organization_coordsys_id INTEGER NOT NULL, definition  TEXT NOT NULL, description TEXT );
           
            INSERT INTO gpkg_spatial_ref_sys VALUES ('Undefined Cartesian SRS',-1,'NONE',-1,'undefined','undefined Cartesian coordinate reference system');
            INSERT INTO gpkg_spatial_ref_sys VALUES ('Undefined geographic SRS',0,'NONE',0,'undefined','undefined geographic coordinate reference system');
            INSERT INTO gpkg_spatial_ref_sys VALUES ('WGS 84 / Pseudo-Mercator',3857,'EPSG',3857,'PROJCS["WGS 84 / Pseudo-Mercator",GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4326"]],PROJECTION["Mercator_1SP"],PARAMETER["central_meridian",0],PARAMETER["scale_factor",1],PARAMETER["false_easting",0],PARAMETER["false_northing",0],UNIT["metre",1,AUTHORITY["EPSG","9001"]],AXIS["Easting",EAST],AXIS["Northing",NORTH],EXTENSION["PROJ4","+proj=merc +a=6378137 +b=6378137 +lat_ts=0 +lon_0=0 +x_0=0 +y_0=0 +k=1 +units=m +nadgrids=@null +wktext +no_defs"],AUTHORITY["EPSG","3857"]]',NULL);
            INSERT INTO gpkg_spatial_ref_sys VALUES ('WGS 84 geodetic',4326,'EPSG',4326,'GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AXIS["Latitude",NORTH],AXIS["Longitude",EAST],AUTHORITY["EPSG","4326"]]','longitude/latitude coordinates in decimal degrees on the WGS 84 spheroid');
            `)

        }

    }

}
