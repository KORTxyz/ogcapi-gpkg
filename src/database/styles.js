const getStyles = async (db) => db.prepare(`
  SELECT style, description
  FROM  gpkgext_styles
`).all();

const getStyle = (db, styleId) => db.prepare(`
  SELECT style, description
  FROM  gpkgext_styles
  WHERE style=?
`).get(styleId);

const getStylesheet = (db, styleId) => db.prepare(`
    SELECT stylesheet
    FROM  gpkgext_stylesheets
    WHERE style_id=?
`).pluck().get(styleId);


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
  getStyles,
  getStyle,
  getStylesheet,

  getCollectionStyles,
  getCollectionStyle,
  getCollectionStylesheet
}