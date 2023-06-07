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

const tilesets = (collectionId) => ({
  "links": [
    {
      "rel": "self",
      "type": "application/json",
      "title": "This document",
      "href": `${baseurl}/collections/${collectionId}/tiles?f=json`
    },
    {
      "rel": "alternate",
      "type": "text/html",
      "title": "This document as HTML",
      "href": `${baseurl}/collections/${collectionId}/tiles?f=html`
    }
  ],
  "tilesets": [module.exports.tileset(collectionId)]
});

const tileset = (collectionId) => ({
  "dataType": "map",
  "crs": "string",
  "tileMatrixSetURI": "string",
  "links": [
  {
    "rel": "item",
    "type": "image/*", //TODO:How to figure out this?
    "title": "template for tiles",
    "href": `${baseurl}/collections/${collectionId}/tiles/${collectionId}/{tileMatrix}/{tileRow}/{tileCol}`,
    "templated": true
  },
  {
    "rel": "http://www.opengis.net/def/rel/ogc/1.0/tiling-scheme",
    "type": "application/json",
    "title": "the tile matrix set for this tileset",
    "href": `${baseurl}/collections/${collectionId}/tiles/${collectionId}?f=json`
  },
  {
    "rel": "http://www.opengis.net/def/rel/ogc/1.0/tiling-scheme",
    "type": "text/html",
    "title": "the tile matrix set for this tileset",
    "href": `${baseurl}/collections/${collectionId}/tiles/${collectionId}?f=html`
  }]
})

module.exports = {
  tileMatrixSets,
  tileMatrixSet,
  tilesets,
  tileset
}