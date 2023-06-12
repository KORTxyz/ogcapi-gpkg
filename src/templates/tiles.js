const { baseurl } = process.env;

const tileMatrixSetURI = {
  3857: "http://www.opengis.net/def/tilematrixset/OGC/1.0/WebMercatorQuad",
  4326: "http://www.opengis.net/def/tilematrixset/OGC/1.0/WorldCRS84Quad",
  3395: "http://www.opengis.net/def/tilematrixset/OGC/1.0/WorldMercatorWGS84Quad"
}

const getTileMatrix = (tileMatrixSet, tilematrix) => ({
  "id": tilematrix.zoom_level,
  "tileWidth": tilematrix.tile_width,
  "tileHeight": tilematrix.tile_height,
  "matrixWidth": tilematrix.matrix_width,
  "matrixHeight": tilematrix.matrix_height,
  "scaleDenominator": tilematrix.pixel_x_size / 0.00028,
  "cellSize": tilematrix.pixel_x_size,
  "topLeftCorner": [
    tileMatrixSet.min_x,
    tileMatrixSet.max_y,
  ]
});

const tileMatrixSets = (tileMatrixSets) => ({
  "links": [
    {
      "rel": "self",
      "type": "application/json",
      "title": "This document",
      "href": baseurl + "/tileMatrixSets?f=json"
    },
    {
      "rel": "alternate",
      "type": "text/html",
      "title": "This document as HTML",
      "href": baseurl + "/tileMatrixSets?f=html"
    }
  ],
  "tileMatrixSets": tileMatrixSets.map(tileMatrixSet => {
    const { table_name, srs_id } = tileMatrixSet;
    return {
      "id": "WebMercatorQuad",
      "title": "TileMatrixSets for collection " + table_name,
      "tileMatrixSetURI": tileMatrixSetURI[srs_id] || "No known URI",
      "links": [
        {
          "rel": "self",
          "type": "application/json",
          "title": `Tile matrix set '${table_name}'`,
          "href": `${baseurl}/tileMatrixSets/${table_name}?f=json`
        },
        {
          "rel": "alternate",
          "type": "text/html",
          "title": `Tile matrix set '${table_name}'`,
          "href": `${baseurl}/tileMatrixSets/${table_name}?f=html`
        }
      ],
    }
  })
})


const tileMatrixSet = (tileMatrixSet, tileMatrices) => {
  const { table_name, srs_id } = tileMatrixSet;
  let templated = {
    "id": table_name,
    "title": "TileMatrixSets for collection " + table_name,
    "tileMatrixSetURI": tileMatrixSetURI[srs_id] || "No known URI",
    "links": [
      {
        "rel": "self",
        "type": "application/json",
        "title": `Tile matrix set '${table_name}'`,
        "href": `${baseurl}/tileMatrixSets/${table_name}?f=json`
      },
      {
        "rel": "alternate",
        "type": "text/html",
        "title": `Tile matrix set '${table_name}'`,
        "href": `${baseurl}/tileMatrixSets/${table_name}?f=html`
      }
    ],
  }

  if (!tileMatrices) return templated;
  return {
    ...templated,
    "crs": "http://www.opengis.net/def/crs/EPSG/0/" + srs_id,
    "tileMatrices": tileMatrices.map(tileMatrix => getTileMatrix(tileMatrixSet, tileMatrix)),
    "orderedAxes": [
      "X",
      "Y"
    ]
  }

};

const tilesets = (collection) => {
  const {table_name} = collection
  return {
    "links": [
      {
        "rel": "self",
        "type": "application/json",
        "title": "This document",
        "href": `${baseurl}/collections/${table_name}/tiles?f=json`
      },
      {
        "rel": "alternate",
        "type": "text/html",
        "title": "This document as HTML",
        "href": `${baseurl}/collections/${table_name}/tiles?f=html`
      }
    ],
    "tilesets": [module.exports.tileset(collection)]
  }
};

const tileset = (collection) => {
  
  const {table_name, extension_name, srs_id} = collection
   
  return {
  "dataType": extension_name == "gpkg_mapbox_vector_tiles" ? "vector": "map",
  "crs": "epsg:"+srs_id,
  "tileMatrixSetURI": table_name,
  "links": [
    {
      "rel": "item",
      "type": extension_name == "gpkg_mapbox_vector_tiles" ? "application/vnd.mapbox-vector-tile": "image/*",
      "title": "template for tiles",
      "href": `${baseurl}/collections/${table_name}/tiles/${table_name}/{tileMatrix}/{tileRow}/{tileCol}`,
      "templated": true
    },
    {
      "rel": "http://www.opengis.net/def/rel/ogc/1.0/tiling-scheme",
      "type": "application/json",
      "title": "the tile matrix set for this tileset",
      "href": `${baseurl}/tileMatrixSets/${table_name}?f=json`
    },
    {
      "rel": "http://www.opengis.net/def/rel/ogc/1.0/tiling-scheme",
      "type": "text/html",
      "title": "the tile matrix set for this tileset",
      "href": `${baseurl}/tileMatrixSets/${table_name}?f=html`
    }]
}}


const tilejson = (collection, vectorLayers) => {
  const {table_name, description, min_x, min_y, max_x, max_y} = collection
   
  return {
    "hello":"test",
    "tilejson": "3.0.0",
    "name": table_name, 
    "description": description,
    "tiles": [
      `${baseurl}/collections/${table_name}/tiles/${table_name}/{z}/{x}/{y}`
    ],
    "vector_layers": vectorLayers.map(vl => ({
        "id": vl.name,
        "fields": {},
        "description": vl.description,
        "maxzoom": vl.maxzoom,
        "minzoom": vl.minzoom,
        "geometry_type": "unknown"
      })
    ),
    "bounds": [
      min_x,
      min_y,
      max_x,
      max_y
    ]
}}


module.exports = {
  tileMatrixSets,
  tileMatrixSet,
  tilesets,
  tileset,
  tilejson
}