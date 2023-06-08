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