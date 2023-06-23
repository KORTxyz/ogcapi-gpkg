const { baseurl } = process.env;

const { Projections, ProjectionConstants } = require("@ngageoint/projections-js");

const projection = Projections.getProjectionForName("EPSG:4326");


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
  console.log("template.tilejson",collection)
  let {name, description, min_x, min_y, max_x, max_y, srs_id, minzoom, maxzoom} = collection;

  if(srs_id !== 4326){
    const storageProjection = Projections.getProjectionForName("EPSG:"+srs_id);
    const wgs84Projection = Projections.getProjectionForName("EPSG:4326");
    const transformation = Projections.getProjectionTransformation(storageProjection, wgs84Projection);

    [min_x, min_y, max_x, max_y] = [...transformation.transformCoordinateArray([min_x, min_y]),...transformation.transformCoordinateArray([max_x, max_y])]
  }

  if(collection["data_type"] == "features") return dynamicTilejson(name, description, min_x, min_y, max_x, max_y, srs_id, minzoom, maxzoom) 

  return {
    "tilejson": "3.0.0",
    "name": name, 
    "description": description,
    "tiles": [
      `${baseurl}/collections/${name}/tiles/${name}/{z}/{x}/{y}`
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
    "minzoom": minzoom,
    "maxzoom": maxzoom,
    "center":[
      max_y-min_y,
      max_x-min_x,
      Math.floor(maxzoom-minzoom/2)
    ],
    "bounds": [
      min_x,
      min_y,
      max_x,
      max_y
    ]
}}

const dynamicTilejson = (name, description, min_x, min_y, max_x, max_y, srs_id, minzoom, maxzoom) => ({
    "tilejson": "3.0.0",
    "name": name, 
    "description": description,
    "tiles": [
      `${baseurl}/collections/${name}/tiles/webmercator/{z}/{x}/{y}`
    ],
    "vector_layers": [{
        "id": name,
        "fields": {},
        "description": description,
        "maxzoom": 0,
        "minzoom": 14,
        "geometry_type": "unknown"
      }]
    ,
    "minzoom": 0,
    "maxzoom": 14,
    "center":[
      max_y-min_y,
      max_x-min_x,
      Math.floor(maxzoom-minzoom/2)
    ],
    "bounds": [
      min_x,
      min_y,
      max_x,
      max_y
    ]
})


module.exports = {
  tileMatrixSets,
  tileMatrixSet,
  tilesets,
  tileset,
  tilejson
}