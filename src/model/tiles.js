const getTileMatrixSets = () => db.prepare("SELECT table_name, srs_id FROM gpkg_tile_matrix_set").all();
const getTileMatrixSet = (tileMatrixSet) => db.prepare("SELECT * FROM gpkg_tile_matrix_set WHERE table_name=?").get(tileMatrixSet);

const getTileMatrices = (tileMatrixSet) => db.prepare("SELECT * FROM gpkg_tile_matrix WHERE table_name=?").all(tileMatrixSet);

const getCollectionTile = async (collectionId, tileMatrix, tileRow, tileCol) => {
  const stmt = `SELECT tile_data FROM '${collectionId}' WHERE zoom_level=? and tile_column=? and tile_row=?`
  const tile = db.prepare(stmt).get(tileMatrix, tileRow, tileCol)
  return tile?.tile_data || null;
}


module.exports = {
  getTileMatrixSets,
  getTileMatrixSet,
  getTileMatrices,
  getCollectionTile
}