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