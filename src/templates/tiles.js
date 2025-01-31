import { Projections } from "@ngageoint/projections-js";

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

const tileMatrixSets = (baseurl, tileMatrixSets) => ({
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

const tileMatrixSet = (baseurl, tileMatrixSet, tileMatrices) => {
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


const collectionTileSets = (baseurl, collection) => {
  const { name } = collection
  return {
    "links": [
      {
        "rel": "self",
        "type": "application/json",
        "title": "This document",
        "href": `${baseurl}/collections/${name}/tiles?f=json`
      },
      {
        "rel": "alternate",
        "type": "text/html",
        "title": "This document as HTML",
        "href": `${baseurl}/collections/${name}/tiles?f=html`
      }
    ],
    "tilesets": [collectionTileSet(baseurl, collection)]
  }
};

const collectionTileSet = (baseurl, collection, layers) => {
  const { name, description, srs_id } = collection
  let { min_x, min_y, max_x, max_y } = collection;

  if (srs_id !== 4326) {
    const storageProjection = Projections.getProjectionForName("EPSG:" + srs_id);
    const wgs84Projection = Projections.getProjectionForName("EPSG:4326");
    const transformation = Projections.getProjectionTransformation(storageProjection, wgs84Projection);

    [min_x, min_y, max_x, max_y] = [...transformation.transformCoordinateArray([min_x, min_y]), ...transformation.transformCoordinateArray([max_x, max_y])]
  }
  return {
    "tileMatrixSetURI": "http://www.opengis.net/def/tilematrixset/OGC/1.0/WebMercatorQuad",
    "title": name,
    "description": description,
    "crs": "epsg:3857",
    "boundingBox": {
      "lowerLeft": [min_y, min_x],
      "upperRight": [max_y, max_x],
      "crs": "epsg:4326",
    },
    "centerPoint": {
      "coordinates": [
        (max_y + min_y) / 2,
        (max_x + min_x) / 2
      ]
    },
    "dataType": "vector",
    "layers": layers,
    "links": [
      {
        "rel": "self",
        "type": "application/json",
        "title": "This document",
        "href": `${baseurl}/collections/${name}/tiles/WebMercatorQuad?f=json`
      },
      {
        "rel": "alternate",
        "type": "application/vnd.mapbox.tile+json",
        "title": "This document as TileJSON",
        "href": `${baseurl}/collections/${name}/tiles/WebMercatorQuad?f=html`
      },
      {
        "rel": "http://www.opengis.net/def/rel/ogc/1.0/tiling-scheme",
        "type": "application/json",
        "title": "the tile matrix set for this tileset",
        "href": `${baseurl}/tileMatrixSets/WebMercatorQuad?f=json`
      },
      {
        "rel": "http://www.opengis.net/def/rel/ogc/1.0/tiling-scheme",
        "type": "text/html",
        "title": "the tile matrix set for this tileset",
        "href": `${baseurl}/tileMatrixSets/WebMercatorQuad?f=html`
      },
      {
        "rel": "item",
        "type": "application/vnd.mapbox-vector-tile",
        "title": "template for tiles",
        "href": `${baseurl}/collections/${name}/tiles/WebMercatorQuad/{tileMatrix}/{tileRow}/{tileCol}`,
        "templated": true
      }
    ]
  }

};

const collectionMapTileSets = (baseurl, collection) => {
  const { name } = collection
  return {
    "links": [
      {
        "rel": "self",
        "type": "application/json",
        "title": "This document",
        "href": `${baseurl}/collections/${name}/tiles?f=json`
      },
      {
        "rel": "alternate",
        "type": "text/html",
        "title": "This document as HTML",
        "href": `${baseurl}/collections/${name}/tiles?f=html`
      }
    ],
    "tilesets": [collectionMapTileSet(baseurl, collection)]
  }
};

const collectionMapTileSet = (baseurl, collection) => {

  const { name, description, srs_id, tileMatrixSetLimits } = collection
  let { min_x, min_y, max_x, max_y } = collection;

  if (srs_id !== 4326) {
    const storageProjection = Projections.getProjectionForName("EPSG:" + srs_id);
    const wgs84Projection = Projections.getProjectionForName("EPSG:4326");
    const transformation = Projections.getProjectionTransformation(storageProjection, wgs84Projection);

    [min_x, min_y, max_x, max_y] = [...transformation.transformCoordinateArray([min_x, min_y]), ...transformation.transformCoordinateArray([max_x, max_y])]
  }

  return {
    "tileMatrixSetURI": "http://www.opengis.net/def/tilematrixset/OGC/1.0/WebMercatorQuad",
    "tileMatrixSetLimits": tileMatrixSetLimits,
    "title": name,
    "description": description,
    "crs": "epsg:3857",
    "boundingBox": {
      "lowerLeft": [min_y, min_x],
      "upperRight": [max_y, max_x],
      "crs": "epsg:4326",
    },
    "centerPoint": {
      "coordinates": [
        (max_y + min_y) / 2,
        (max_x + min_x) / 2
      ]
    },
    "dataType": "map",
    "links": [
      {
        "rel": "self",
        "type": "application/json",
        "title": "This document",
        "href": `${baseurl}/collections/${name}/map/tiles/WebMercatorQuad?f=json`
      },
      {
        "rel": "alternate",
        "type": "application/vnd.mapbox.tile+json",
        "title": "This document as TileJSON",
        "href": `${baseurl}/collections/${name}/map/tiles/WebMercatorQuad?f=html`
      },
      {
        "rel": "http://www.opengis.net/def/rel/ogc/1.0/tiling-scheme",
        "type": "application/json",
        "title": "the tile matrix set for this tileset",
        "href": `${baseurl}/tileMatrixSets/WebMercatorQuad?f=json`
      },
      {
        "rel": "http://www.opengis.net/def/rel/ogc/1.0/tiling-scheme",
        "type": "text/html",
        "title": "the tile matrix set for this tileset",
        "href": `${baseurl}/tileMatrixSets/WebMercatorQuad?f=html`
      },
      {
        "rel": "item",
        "type": "application/vnd.mapbox-vector-tile",
        "title": "template for maptiles",
        "href": `${baseurl}/collections/${name}/map/tiles/WebMercatorQuad/{tileMatrix}/{tileRow}/{tileCol}`,
        "templated": true
      }
    ]
  }
};


export {
  tileMatrixSets,
  tileMatrixSet,

  collectionTileSets,
  collectionTileSet,

  collectionMapTileSets,
  collectionMapTileSet
}