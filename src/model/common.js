const getCollections = (q, keywords, limit, offset, bbox) => {
  q = q ? `  (identifier LIKE '%${q}%' OR description LIKE '%${q}%' )` : "1=1";

  return db.prepare(`
  SELECT * 
  FROM  gpkg_contents
  WHERE ${q} AND data_type != 'attributes'
  LIMIT ${limit || 999}
  OFFSET ${offset || 0}
  `).all();

}

const getCollection = (collectionId) => db.prepare('SELECT * FROM gpkg_contents WHERE table_name=?').get(collectionId);

module.exports = {
  getCollections,
  getCollection
}