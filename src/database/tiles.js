import * as featuresModel from "./features.js";

import vtpbf from 'vt-pbf';
import geojsonVt from 'geojson-vt';

import { SphericalMercator } from '@mapbox/sphericalmercator';

const merc = new SphericalMercator({
  size: 512,
  antimeridian: true
});

const getTileMatrixSets = () => db.prepare("SELECT table_name, srs_id FROM gpkg_tile_matrix_set").all();

const getTileMatrixSet = (tileMatrixSet) => db.prepare("SELECT * FROM gpkg_tile_matrix_set WHERE table_name=?").get(tileMatrixSet);

const getTileMatrices = (tileMatrixSet) => db.prepare("SELECT * FROM gpkg_tile_matrix WHERE table_name=?").all(tileMatrixSet);

const getTileMatrixSetLimits = (db, collectionId) => db.prepare(`
  SELECT 
    zoom_level as "tileMatrix", 
    min(tile_row) as "minTileRow",
    max(tile_row) as "maxTileRow",
    min(tile_column) as "minTileCol",
    max(tile_column) as "maxTileCol"
  FROM '${collectionId}' 
  GROUP BY zoom_level;
`).all();


const getCollectionTile = async (db, collectionId, tileMatrix, tileRow, tileCol) => {
  const stmt = `SELECT tile_data FROM '${collectionId}' WHERE zoom_level=? and tile_row=? and tile_column=?`
  try {
    const tile = db.prepare(stmt).get(tileMatrix, tileRow, tileCol)
    return tile?.tile_data || null;
  } catch (err) {
    throw err
  }
};

const getAsVectorTile = async (db, collectionId, tileMatrix, tileRow, tileCol, limit, properties) => {
  const bbox = merc.bbox(tileRow, tileCol, tileMatrix, false)

  const features = await featuresModel.getItems(db, collectionId, limit, 0, bbox.join(), properties, [])

  if (features?.length > 0) {
    const tileindex = geojsonVt({ type: 'FeatureCollection', features: features }, { maxZoom: 18, promoteId: Object.keys(features[0].properties)[0] })
    const tile = tileindex.getTile(Number(tileMatrix), Number(tileRow), Number(tileCol))
    if (!tile) return null;

    let Obj = {};
    Obj[collectionId] = tile;

    const pbf = vtpbf.fromGeojsonVt(Obj, { version: 2 });

    return pbf
  }
  else return null;

};

const getVectorTilesSpec = (db, collectionId) => db.prepare(`
  SELECT 
    gvl.name as id, 
    gvl.description, 
    'vector' as dataType,
    minzoom as minTileMatrix,
    maxzoom as maxTileMatrix,
    CASE 
      WHEN
      gvf.name is null THEN NULL
      ELSE
      json_object(
        'properties',
        json_group_object(
          gvf.name,
          json_object(
            'title',gvf.name,
            'type',gvf.type
          )
        ),

        'type', 
        'object'
      )
    END as propertiesSchema
  FROM
    gpkgext_vt_layers gvl
  LEFT JOIN
    gpkgext_vt_fields gvf ON gvl.name=gvf.layer_id
  WHERE
    table_name=?
  GROUP BY 
    gvl.name
`).all(collectionId).map(e => ({ ...e, propertiesSchema: JSON.parse(e.propertiesSchema) }));


export {
  getTileMatrixSets,
  getTileMatrixSet,
  getTileMatrices,

  getTileMatrixSetLimits,
  getCollectionTile,

  getAsVectorTile,
  getVectorTilesSpec
}