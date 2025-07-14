import * as helpers from '../helpers/features.js'

const getGeomMetadata = (db, collectionId) => db.prepare('SELECT column_name as geomColName, srs_id as srsId FROM gpkg_geometry_columns WHERE table_name=?').get(collectionId);

const getItems = async (db, collectionId, limit, offset, bbox, properties, options) => {
    const { geomColName, srsId } = getGeomMetadata(db, collectionId);
    const select = helpers.formatSelect(properties, geomColName);
    let fromStatement = `${collectionId} c`;

    let whereStatement = helpers.getWhereStatement(options);
    if (bbox) {
        fromStatement = `rtree_${collectionId}_${geomColName} r LEFT JOIN ${collectionId} c ON r.id=c.ROWID`;
        whereStatement = helpers.appendRthreeFilter(whereStatement, bbox, srsId)
    }

    const sql = `
        SELECT ${select}
        FROM  ${fromStatement}
        WHERE ${whereStatement}
        LIMIT ${limit || 999}
        OFFSET ${offset || 0}
    `;

    const features = db.prepare(sql).all();
    const geojsonfeatures = features.map(feature => helpers.toGeoJSON(feature, geomColName))

    return geojsonfeatures
}

const postItems = async (db, collectionId, geojson) => {
    const { geomCol, srsId } = db.prepare('SELECT column_name as geomCol, srs_id as srsId FROM gpkg_geometry_columns WHERE table_name=?', [collectionId]).get(collectionId);

    for (const feature of geojson.features) {

        const geometryData = helpers.toGPGKgeometry(feature,srsId);

        const sql = `
            INSERT INTO ${collectionId}(${[...Object.keys(feature.properties), geomCol].join(",")})
            VALUES (${[...Object.keys(feature.properties).map(() => '?'), '?'].join(",")});
        `
        db.prepare(sql).run(Object.values(feature.properties), geometryData);

        

    }
    //TODO: add update of gpkg_content metadata last_change, bbox
    
    return {}
}

const getItem = async (db, collectionId, featureId) => {
    const { geomCol } = db.prepare('SELECT column_name as geomCol FROM gpkg_geometry_columns WHERE table_name=?').get(collectionId);

    const feature = db.prepare(`SELECT *,ROWID as ROWID FROM ${collectionId} WHERE ROWID=?`).get(featureId);

    if (!feature) return;
    return {
        "type": "FeatureCollection",
        "features": [helpers.toGeoJSON(feature, geomCol)]
    }
};


const getSchema = (db, collectionId) => {

    let table_info = db.prepare(`SELECT name, type FROM pragma_table_info('${collectionId}')`).all()

    let [geometryType, properties] = helpers.partition(table_info, column => helpers.isGeometryType(column.type));

    properties = properties.reduce((next, column) => {
        return { ...next, [column.name]: { title: column.name, ...helpers.convertSQLITEtype(column.type) } };
    }, {})

    geometryType = table_info.filter(column => helpers.isGeometryType(column.type))[0].type;

    const existGpkgSchema = db.prepare("SELECT * from gpkg_extensions where extension_name='gpkg_schema'").get();

    if (existGpkgSchema != undefined) {
        const data_columns = db.prepare(`
            SELECT a.column_name, a.title, a.description,'[' || group_concat('{"type": "string", "const":"' || b.value || '","description":"' || b.description || '"}', ',') || ']' as "values" 
            FROM gpkg_data_columns a
            LEFT JOIN gpkg_data_column_constraints b ON a.constraint_name=b.constraint_name 
            WHERE a.table_name = '${collectionId}'
            GROUP BY a.column_name, a.title, a.description
        `).all();

        data_columns.map(column => {
            let schema = { name: column.column_name, properties: { title: column.title, description: column.description } }
            if (column.values) schema.properties.oneOf = JSON.parse(column.values)
            return schema
        }).forEach(column => {
            const type = properties[column.name].type
            properties[column.name] = { type: type, ...column.properties }
        })
    }

    return { properties, geometryType }
};


export {
    getItems,
    postItems,
    getItem,
    getSchema
}