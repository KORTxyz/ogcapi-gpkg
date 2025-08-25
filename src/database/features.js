import * as helpers from '../helpers/features.js'

const getGeomMetadata = (db, collectionId) => db.prepare('SELECT column_name as geomColName, srs_id as srsId FROM gpkg_geometry_columns WHERE table_name=?').get(collectionId);

const getTableinfo = (db, collectionId) => db.prepare('SELECT name, type, pk FROM pragma_table_info(?)').all(collectionId);

const getDataColumns = (db, collectionId) => {
    db.prepare(`
            SELECT a.column_name, a.title, a.description,'[' || group_concat('{"type": "string", "const":"' || b.value || '","description":"' || b.description || '"}', ',') || ']' as "values" 
            FROM gpkg_data_columns a
            LEFT JOIN gpkg_data_column_constraints b ON a.constraint_name=b.constraint_name 
            WHERE a.table_name = ?
            GROUP BY a.column_name, a.title, a.description
        `).all(collectionId);

    return data_columns.map(column => ({
        name: column.column_name,
        properties: {
            title: column.title,
            description: column.description,
            ...(column.values ? { oneOf: JSON.parse(column.values) } : {})
        }
    }));
}

const getItems = async (db, collectionId, limit, offset, bbox, properties, options) => {
    const { geomColName, srsId } = getGeomMetadata(db, collectionId);

    const tableinfo = getTableinfo(db, collectionId);
    const primaryKey = tableinfo.find(e => e.pk == 1).name;

    const select = helpers.formatSelect(properties, primaryKey, geomColName);
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
    const geojsonfeatures = features.map(feature => helpers.toGeoJSON(feature, primaryKey, geomColName))

    return geojsonfeatures
}


const postItems = async (db, collectionId, feature) => {
    const { geomColName, srsId } = getGeomMetadata(db, collectionId);
    const tableinfo = getTableinfo(db, collectionId);
    const primaryKey = tableinfo.find(e => e.pk == 1).name;

    const geometryData = helpers.toGPGKgeometry(feature, srsId);

    const sql = `
        INSERT INTO ${collectionId}(${[...Object.keys(feature.properties), geomColName].join(",")})
        VALUES (${[...Object.keys(feature.properties).map(() => '?'), '?'].join(",")});
    `;
    const stmt = db.prepare(sql);
    const info = stmt.run(Object.values(feature.properties), geometryData);
    const newFeature = db.prepare(`SELECT * FROM ${collectionId} WHERE rowid = ?`).get(info.lastInsertRowid);
    //TODO: add update of gpkg_content metadata last_change, bbox.

    return helpers.toGeoJSON(newFeature, primaryKey, geomColName);
}


const getItem = async (db, collectionId, featureId) => {
    const { geomColName } = getGeomMetadata(db, collectionId);
    const tableinfo = getTableinfo(db, collectionId);
    const primaryKey = tableinfo.find(e => e.pk == 1).name;

    const feature = db.prepare(`SELECT *,ROWID as ROWID FROM ${collectionId} WHERE ROWID=?`).get(featureId);

    if (!feature) return;
    return {
        "type": "FeatureCollection",
        "features": [helpers.toGeoJSON(feature, primaryKey, geomColName)]
    }
};


const putItem = async (db, collectionId, featureId, feature) => {
    const { geomColName, srsId } = getGeomMetadata(db, collectionId);
    const tableinfo = getTableinfo(db, collectionId);
    const primaryKey = tableinfo.find(e => e.pk == 1).name;
    const geometryData = helpers.toGPGKgeometry(feature, srsId);

    const sql = `
        INSERT OR REPLACE INTO ${collectionId}(rowid, ${[...Object.keys(feature.properties), geomColName].join(",")})
        VALUES (${featureId}, ${[...Object.keys(feature.properties).map(() => '?'), '?'].join(",")})
        RETURNING *;
    `;
    const stmt = db.prepare(sql);
    const info = stmt.run(Object.values(feature.properties), geometryData);
    const editedFeature = db.prepare(`SELECT * FROM ${collectionId} WHERE rowid = ?`).get(featureId);

    return helpers.toGeoJSON(editedFeature, primaryKey, geomColName);
};


const patchItem = async (db, collectionId, featureId, feature) => {
    const { geomColName, srsId } = getGeomMetadata(db, collectionId);
    const tableinfo = getTableinfo(db, collectionId);
    const primaryKey = tableinfo.find(e => e.pk == 1).name;

    let fields = Object.keys(feature.properties).map(key => `${key} = @${key}`);
    let params = {
        ...feature.properties,
        rowid: featureId
    };

    if (feature.geometry) {
        fields = [...fields, `${geomColName} = @geom`]
        params.geom = helpers.toGPGKgeometry(feature, srsId);
    }

    const stmt = db.prepare(`
        UPDATE ${collectionId}
        SET ${fields.join(', ')}
        WHERE rowid = @rowid
    `);
    const info = stmt.run(params);
    const editedFeature = db.prepare(`SELECT * FROM ${collectionId} WHERE rowid = ?`).get(featureId);

    return helpers.toGeoJSON(editedFeature, primaryKey, geomColName);
};


const deleteItem = async (db, collectionId, featureId) => db.prepare(`DELETE FROM ${collectionId} WHERE rowid = ?`).run(featureId);


const getSchema = (db, collectionId) => {

    const tableinfo = getTableinfo(db, collectionId);
    const geometryColumn = tableinfo.find(column => helpers.isGeometryType(column.type));
    const geometryType = geometryColumn?.type;


    let properties = tableinfo
        .filter(column => column.name != geometryColumn.name)
        .filter(column => column.pk != 1)
        .reduce((acc, column) => (
            acc[column.name] = { title: column.name, ...helpers.convertSQLITEtype(column.type) }, acc
        ), {});

    // If gpkg_schema extension exists, enrich properties with gpkg_data_columns
    const existGpkgSchema = db.prepare("SELECT * FROM gpkg_extensions WHERE extension_name='gpkg_schema'").get();

    if (existGpkgSchema) {
        const dataColumns = getDataColumns(db,collectionId);
        
        dataColumns.forEach(dataColumn => {
            properties[dataColumn.name] = { 
                type: properties[dataColumn.name].type, 
                ...dataColumn.properties }
        })
    }

    return { properties, geometryType }
};


export {
    getItems,
    postItems,
    getItem,
    putItem,
    patchItem,
    deleteItem,
    getSchema
}