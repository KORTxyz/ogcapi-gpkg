
const getCollectionStyles = async (db, collectionId) => db.prepare(`
    SELECT styleName,useAsDefault, description
    FROM  layer_styles
    WHERE f_table_name=?
  `).all(collectionId);

const getCollectionStyle = (db, collectionId, styleId) => db.prepare(`
    SELECT *
    FROM  layer_styles
    WHERE f_table_name=? AND styleName=?
  `).get(collectionId, styleId);

const getCollectionStylesheet = (db, collectionId, styleId, format) => db.prepare(`
      SELECT style${format} as stylesheet
      FROM  layer_styles
      WHERE f_table_name=? AND styleName=?
  `).pluck().get(collectionId, styleId);

  export {
    getCollectionStyles,
    getCollectionStyle,
    getCollectionStylesheet
  }