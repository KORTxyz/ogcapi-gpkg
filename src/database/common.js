const getCollections = (db, q, keywords, limit, offset, bbox) => {
  const whereClause = q ? `  (identifier LIKE '%${q}%' OR description LIKE '%${q}%' )` : "1=1";

  return db.prepare(`
      SELECT c.table_name as name, * 
      FROM  gpkg_contents c
      WHERE 
          ${whereClause} 
        AND 
          data_type != 'attributes'
      LIMIT ${limit || 999}
      OFFSET ${offset || 0}
    `).all();

};


const getCollection = (db, collectionId) => db.prepare(`
  SELECT c.table_name as name, c.*, e.*, g.geometry_type_name
  FROM gpkg_contents c 
  LEFT JOIN gpkg_extensions e ON c.table_name=e.table_name
  LEFT JOIN gpkg_geometry_columns g ON c.table_name=g.table_name
  WHERE c.table_name=?
`).get(collectionId);


export {
  getCollections,
  getCollection
}