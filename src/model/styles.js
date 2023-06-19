const createStylesTable = () => {
  const sql = `
    INSERT INTO gpkg_extensions (table_name, extension_name, definition, scope)
        Select 'gpkgext_styles', 'im_portrayal', 'https://gitlab.com/imagemattersllc/ogc-tb-16-gpkg/-/blob/master/extensions/5-portrayal.adoc','read-write' Where not exists(select * from gpkg_extensions where table_name='gpkgext_styles');

    CREATE TABLE if not exists gpkgext_styles (
        id INTEGER PRIMARY KEY,
        style TEXT NOT NULL,
        description TEXT,
        uri TEXT
      );


    INSERT INTO gpkg_extensions (table_name, extension_name, definition, scope)
        Select 'gpkgext_stylesheets', 'im_portrayal', 'https://gitlab.com/imagemattersllc/ogc-tb-16-gpkg/-/blob/master/extensions/5-portrayal.adoc','read-write' Where not exists(select * from gpkg_extensions where table_name='gpkgext_stylesheets');

    CREATE TABLE if not exists gpkgext_stylesheets (
        id INTEGER PRIMARY KEY,
        style_id INTEGER NOT NULL,
        format TEXT NOT NULL,
        stylesheet TEXT NOT NULL
    );
    `
  globalThis.db.exec(sql);
}

const getStyles = () => db.prepare("SELECT a.id,style,description,format FROM gpkgext_styles a LEFT JOIN gpkgext_stylesheets b ON a.id=b.style_id").all();

const getStyle = (styleId,format) => db.prepare("SELECT a.id, format, stylesheet FROM gpkgext_styles a LEFT JOIN gpkgext_stylesheets b ON a.id=b.style_id WHERE a.style=? and b.format=?").get(styleId,format);

const addStyle = (style) => {
  style = JSON.parse(style)
  const { lastInsertRowid } = db.prepare("INSERT INTO gpkgext_styles (style, description) VALUES (@style, @description)").run({
    style: style.name,
    description: style.description || style.name
  })

  db.prepare("INSERT INTO gpkgext_stylesheets (style_id, format, stylesheet) VALUES (@style_id, @format, @stylesheet)").run({
    style_id: lastInsertRowid,
    format: "mbstyle",
    stylesheet: JSON.stringify(style)
  })

}

const updateStyle = async (styleId, style) => {
  styleName = JSON.parse(style).name
  if(styleId !== styleName){
    await db.prepare("UPDATE gpkgext_styles SET style=? WHERE style=?").run(styleName,styleId);
    styleId =styleName
  }

  const {id} = await db.prepare("SELECT id from gpkgext_styles WHERE style=?").get(styleId);
  db.prepare("UPDATE gpkgext_stylesheets SET stylesheet=? WHERE style_id=?").run(style, id);
}

const deleteStyle = (styleId) => {
  db.prepare("DELETE FROM gpkgext_styles WHERE id=?").run(styleId);
  db.prepare("DELETE FROM gpkgext_stylesheets WHERE style_id=?").run(styleId);
};



const getResources = () => db.prepare("SELECT symbol, description, format FROM gpkgext_symbols s LEFT JOIN gpkgext_symbol_content c ON s.id=c.id").all();

const getResource = (resourceId) => db.prepare("SELECT content FROM gpkgext_symbols s LEFT JOIN gpkgext_symbol_content c ON s.id=c.id WHERE symbol = ?").get(resourceId).content;

module.exports = {
  createStylesTable,
  getStyles,
  getStyle,
  addStyle,
  updateStyle,
  getResources,
  getResource
}