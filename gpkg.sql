CREATE TABLE "gpkgext_vt_layers" (
	"id"	INTEGER NOT NULL UNIQUE,
	"table_name"	TEXT NOT NULL UNIQUE,
	"name"	TEXT NOT NULL UNIQUE,
	"description"	TEXT,
	"minzoom"	INTEGER,
	"maxzoom"	INTEGER,
	FOREIGN KEY("table_name") REFERENCES "gpkg_contents"("table_name"),
	PRIMARY KEY("id")
);

CREATE TABLE "gpkgext_vt_fields" (
	"id"	INTEGER NOT NULL UNIQUE,
	"layer_id"	INTEGER NOT NULL UNIQUE,
	"name"	TEXT NOT NULL UNIQUE,
	"type"	TEXT NOT NULL,
	FOREIGN KEY("layer_id") REFERENCES "gpkgext_vt_layers"("id"),
	PRIMARY KEY("id")
);

CREATE TABLE vectortiles(
  zoom_level INT,
  tile_column INT,
  tile_row INT,
  tile_data
)

INSERT INTO "main"."gpkg_spatial_ref_sys" ("srs_name", "srs_id", "organization", "organization_coordsys_id", "definition", "description") VALUES ('EPSG:3857', '3857', 'epsg', '3857', 'PROJCS["WGS 84 / Pseudo-Mercator",GEOGCS["WGS 84",DATUM["World Geodetic System 1984",SPHEROID["WGS 84", 6378137.0, 298.257223563, AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich", 0.0, AUTHORITY["EPSG","8901"]],UNIT["degree", 0.017453292519943295],AXIS["Geodetic latitude", NORTH],AXIS["Geodetic longitude", EAST],AUTHORITY["EPSG","4326"]],PROJECTION["Popular Visualisation Pseudo Mercator", AUTHORITY["EPSG","1024"]],PARAMETER["semi_minor", 6378137.0],PARAMETER["latitude_of_origin", 0.0],PARAMETER["central_meridian", 0.0],PARAMETER["scale_factor", 1.0],PARAMETER["false_easting", 0.0],PARAMETER["false_northing", 0.0],UNIT["m", 1.0],AXIS["Easting", EAST],AXIS["Northing", NORTH],AUTHORITY["EPSG","3857"]]', 'WebMercator');

INSERT INTO gpkg_contents (table_name ,data_type,identifier, description, min_x , min_y ,max_x , max_y ,srs_id)
VALUES ('vectortiles','vectortiles','vectortiles','vectortile version of data', 55.590375,12.253189,55.636136,12.402878,4326);

UPDATE "vectortiles" SET "tile_row" = pow(2, "zoom_level") - "tile_row" - 1

CREATE UNIQUE INDEX vectortiles_IDX ON vectortiles (zoom_level,tile_column,tile_row);

CREATE TABLE gpkgext_styles ( id INTEGER PRIMARY KEY, style TEXT, description TEXT, uri TEXT, UNIQUE(uri) );

CREATE TABLE gpkgext_stylesheets ( id INTEGER PRIMARY KEY, style_id INTEGER, format TEXT NOT NULL, stylesheet BLOB NOT NULL, UNIQUE(style_id, format) );

CREATE TABLE gpkgext_symbol_content ( id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, format TEXT NOT NULL, content BLOB NOT NULL, uri TEXT NOT NULL)
CREATE TABLE gpkgext_symbol_images ( id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, content_id INTEGER NOT NULL, symbol_id INTEGER NOT NULL, width INTEGER, height INTEGER, offset_x INTEGER, offset_y INTEGER, pixel_ratio INTEGER)
CREATE TABLE gpkgext_symbols ( id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, uri TEXT, symbol TEXT NOT NULL, title TEXT NOT NULL, description TEXT )