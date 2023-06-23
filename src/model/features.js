const { GeoPackageGeometryData, SpatialReferenceSystem, SpatialReferenceSystemConstants, GeoJSONResultSet } = require('@ngageoint/geopackage');
const { FeatureConverter } = require('@ngageoint/simple-features-geojson-js');
const { Projection, ProjectionConstants, Projections, ProjectionTransform } = require('@ngageoint/projections-js');
const { GeometryTransform } = require('@ngageoint/simple-features-proj-js');

const convertSQLITEtype = (type) => {
    type = type.match(/\w+/g);
    datatypes = {
        "default": { type: "string" },
        "INT": { type: "integer" },
        "INTEGER": { type: "integer" },
        "TINYINT": { type: "integer" },
        "SMALLINT": { type: "integer" },
        "MEDIUMINT": { type: "integer" },
        "BIGINT": { type: "integer" },
        "UNSIGNED BIG INT": { type: "integer" },
        "INT2": { type: "integer" },
        "INT8": { type: "integer" },
        "CHARACTER(20)": { type: "string" },
        "VARCHAR(255)": { type: "string" },
        "VARYING CHARACTER(255)": { type: "string" },
        "NCHAR": { type: "string" },
        "NATIVE CHARACTER)": { type: "string" },
        "NVARCHAR": { type: "string" },
        "TEXT": { type: "string" },
        "CLOB": { type: "string" },
        "BLOB": { type: "string", "contentEncoding": "binary" },
        "REAL": { type: "number" },
        "DOUBLE": { type: "number" },
        "DOUBLE PRECISION": { type: "number" },
        "FLOAT": { type: "number" },
        "NUMERIC": { type: "number" },
        "DECIMAL": { type: "number" },
        "BOOLEAN": { type: "boolean" },
        "DATE": { type: "string", format: "date" },
        "DATETIME": { type: "string", format: "date-time" }
    }
    let schemaDef = datatypes[type[0]] || datatypes["default"]
    if (type[1]) schemaDef.maxLength = Number(type[1])
    return schemaDef
}

const isGeometryType = type => ["POINT", "CURVE", "LINESTRING", "SURFACE", "CURVEPOLYGON", "POLYGON", "GEOMETRYCOLLECTION", "MULTISURFACE", "MULTIPOLYGON", "MULTICURVE", "MULTILINESTRING", "MULTIPOINT"].includes(type);

const partition = (array, filter) => {
    let pass = [], fail = [];
    array.forEach((e, idx, arr) => (filter(e, idx, arr) ? pass : fail).push(e));
    return [pass, fail];
}


const getItems = async (collectionId, limit, offset, bbox, properties, options) => {
    const { geomCol, srsId } = db.prepare('SELECT column_name as geomCol, srs_id as srsId  FROM gpkg_geometry_columns WHERE table_name=?').get(collectionId);

    properties = properties !== undefined ? [properties, geomCol, "c.rowid as rowid"].filter(e => e.length != 0).join(',') : 'c.*,c.ROWID as ROWID ';

    let from = `
    FROM  ${collectionId} c
    WHERE
    `;

    const where = options ? Object.entries(options).map(e => e[0] + " = '" + unescape(e[1]) + "'").join(" AND ") : ""

    if (bbox) {
        const [minx, miny, maxx, maxy] = bbox?.split(",").map(e => Number(e))
        const bounds = srsId != 4326 ? new GeometryTransform(
            Projections.getWGS84Projection(),
            Projections.getProjectionForName("EPSG:"+srsId),
            ).transformBounds(minx, miny, maxx, maxy) : [minx, miny, maxx, maxy];
            
        from = `
        FROM rtree_${collectionId}_${geomCol} r
        LEFT JOIN ${collectionId} c ON r.id=c.rowid 
        WHERE ${bounds[2]} >= r.minx AND ${bounds[0]} <= r.maxx AND ${bounds[3]} >= r.miny AND ${bounds[1]} <= r.maxy AND
        `
    }

    const sql = `
    SELECT ${properties}
    ${from} 
    ${where ? " " + where : "1=1"}
    LIMIT ${limit || 9999}
    OFFSET ${offset || 0}
    `;
    let features = db.prepare(sql).all()
        .map(feature => {
            const { [geomCol]: geom, ROWID, ...properties } = feature;
            for (const key in properties) {
                if (typeof properties[key] === "object") {
                    properties[key] = properties[key] == null ? "" : properties[key].toString('base64')
                }
            }

            const geoPackageGeometryData = new GeoPackageGeometryData(geom); 
            const geometryTransform = new GeometryTransform(
                Projections.getProjectionForName("EPSG:"+geoPackageGeometryData.getSrsId()),
                Projections.getWGS84Projection()
            )

            
            return {
                id: ROWID,
                type: "Feature",
                geometry: FeatureConverter.toFeatureGeometry(geometryTransform.transformGeometry(geoPackageGeometryData.getGeometry())),
                properties
            }
        })
    return features;
}

const postItems = async (collectionId, geojson) => {

    const { geomCol, srsId } = globalThis.db.prepare('SELECT column_name as geomCol, srs_id as srsId FROM gpkg_geometry_columns WHERE table_name=?', [collectionId]).get(collectionId);

    let blobColumns = db.prepare(`SELECT name FROM pragma_table_info('${collectionId}') WHERE type='BLOB'`).pluck().all()


    for (const feature of geojson.features) {

        for (const blobColumn of blobColumns) {
            if (feature.properties[blobColumn]) feature.properties[blobColumn] = Buffer.from(feature.properties[blobColumn], "base64")
        }

        let geometry = FeatureConverter.toSimpleFeaturesGeometry(feature);

        const geometryTransform = new GeometryTransform(
            Projections.getWGS84Projection(),
            Projections.getProjectionForName("EPSG:"+srsId),
        ).transformBounds

        const geometryData = GeoPackageGeometryData.createAndWrite(geometryTransform.transformGeometry(geometry)).toBuffer()
        delete feature.properties[geomCol];

        const sql = `
            INSERT INTO punkter(${[...Object.keys(feature.properties), geomCol].join(",")})
            VALUES (${[...Object.keys(feature.properties).map(() => '?'), '?'].join(",")});
        `

        globalThis.db.prepare(sql).run(Object.values(feature.properties), geometryData);
    }

    return {}
};

const getItem = async (collectionId, featureId, zoomlevel) => {
    const { geomCol } = db.prepare('SELECT column_name as geomCol FROM gpkg_geometry_columns WHERE table_name=?').get(collectionId);

    const feature = db.prepare(`SELECT *,ROWID as ROWID FROM ${collectionId} WHERE ROWID=?`).get(featureId)
    if (!feature) return null;

    const { [geomCol]: geom, ROWID, ...properties } = feature;
    for (const key in properties) {
        if (typeof properties[key] === "object") {
            properties[key] = properties[key].toString('base64')
        }
    }

    return {
        id: ROWID,
        type: "Feature",
        geometry: FeatureConverter.toFeatureGeometry(new GeoPackageGeometryData(geom).getGeometry()),
        properties
    }

};

const getSchema = (collectionId) => {

    let table_info = db.prepare(`SELECT name, type FROM pragma_table_info('${collectionId}')`).all()


    let [geometryType, properties] = partition(table_info, column => isGeometryType(column.type));

    properties = properties.reduce((next, column) => {
        return { ...next, [column.name]: { title: column.name, ...convertSQLITEtype(column.type) } };
    }, {})

    geometryType = table_info.filter(column => isGeometryType(column.type))
  
    const isGpkgSchema = db.prepare("SELECT * from gpkg_extensions where extension_name='gpkg_schema'").get();
    if(isGpkgSchema != undefined){
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
}


module.exports = {
    getItems,
    postItems,
    getItem,
    getSchema
}