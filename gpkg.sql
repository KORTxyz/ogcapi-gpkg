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

UPDATE "vectortiles" SET "tile_row" = pow(2, "zoom_level") - "tile_row" - 1

CREATE UNIQUE INDEX vectortiles_IDX ON vectortiles (zoom_level,tile_column,tile_row);

CREATE TABLE gpkgext_styles ( id INTEGER PRIMARY KEY, style TEXT, description TEXT, uri TEXT, UNIQUE(uri) );

CREATE TABLE gpkgext_stylesheets ( id INTEGER PRIMARY KEY, style_id INTEGER, format TEXT NOT NULL, stylesheet BLOB NOT NULL, UNIQUE(style_id, format) );

CREATE TABLE gpkgext_symbol_content ( id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, format TEXT NOT NULL, content BLOB NOT NULL, uri TEXT NOT NULL)
CREATE TABLE gpkgext_symbol_images ( id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, content_id INTEGER NOT NULL, symbol_id INTEGER NOT NULL, width INTEGER, height INTEGER, offset_x INTEGER, offset_y INTEGER, pixel_ratio INTEGER)
CREATE TABLE gpkgext_symbols ( id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, uri TEXT, symbol TEXT NOT NULL, title TEXT NOT NULL, description TEXT )