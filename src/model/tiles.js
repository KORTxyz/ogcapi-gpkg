const featuresModel = require('./features')

const SphericalMercator = require('@mapbox/sphericalmercator')
const vtpbf = require('vt-pbf')
const geojsonVt = require('geojson-vt')
const merc = new SphericalMercator({
  size: 512,
  antimeridian: true
});

const getTileMatrixSets = () => db.prepare("SELECT table_name, srs_id FROM gpkg_tile_matrix_set").all();
const getTileMatrixSet = (tileMatrixSet) => db.prepare("SELECT * FROM gpkg_tile_matrix_set WHERE table_name=?").get(tileMatrixSet);

const getTileMatrices = (tileMatrixSet) => db.prepare("SELECT * FROM gpkg_tile_matrix WHERE table_name=?").all(tileMatrixSet);

const getAsVectorTile = async (collectionId, tileMatrix, tileRow, tileCol) => {
    const bbox = merc.bbox(tileRow, tileCol, tileMatrix, false)
    const features = await featuresModel.getItems(collectionId, 1000, 0, bbox.join())
    if (features?.length > 0) {
      const tileindex = geojsonVt({ type: 'FeatureCollection', features: features }, { maxZoom: 14, promoteId: Object.keys(features[0].properties)[0] })
      const tile = tileindex.getTile(Number(tileMatrix), Number(tileRow), Number(tileCol))
      if (!tile) return null;

      let Obj = {};
      Obj[collectionId] = tile;

      const pbf = vtpbf.fromGeojsonVt(Obj, { version: 2 });

      return pbf
    }
    return null;

}

const getCollectionTile = async (collectionId, tileMatrix, tileRow, tileCol) => {
  const stmt = `SELECT tile_data FROM '${collectionId}' WHERE zoom_level=? and tile_column=? and tile_row=?`
  try {
    const tile = db.prepare(stmt).get(tileMatrix, tileRow, tileCol)
    return tile?.tile_data || null;

  } catch (err) {
    if( err.message == "no such column: tile_data") return getAsVectorTile(collectionId, tileMatrix, tileRow, tileCol)
    else throw err
  }

}

const getCollectionMetadata = (collectionId) => db.prepare(`
  SELECT c.table_name as name, * 
  FROM gpkg_contents c 
  LEFT JOIN gpkg_extensions e ON c.table_name=e.table_name
  LEFT JOIN (select table_name, max(zoom_level) maxzoom, min(zoom_level) minzoom from gpkg_tile_matrix) t ON c.table_name=t.table_name
  WHERE c.table_name=?
`).get(collectionId);

const getVectorLayers = (collectionId) => db.prepare(`
  SELECT * 
  FROM gpkgext_vt_layers
  WHERE table_name=?
`).all(collectionId);

module.exports = {
  getTileMatrixSets,
  getTileMatrixSet,
  getTileMatrices,
  getCollectionTile,
  getAsVectorTile,
  getCollectionMetadata,
  getVectorLayers
}