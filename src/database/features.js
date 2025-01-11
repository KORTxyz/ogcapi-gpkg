import { GeoPackageGeometryData } from '@ngageoint/geopackage'
import { Projections } from '@ngageoint/projections-js'
import { GeometryTransform } from '@ngageoint/simple-features-proj-js'
import { FeatureConverter } from '@ngageoint/simple-features-geojson-js'

const getGeomMetadata = (db, collectionId) => db.prepare('SELECT column_name as geomColName, srs_id as srsId FROM gpkg_geometry_columns WHERE table_name=?').get(collectionId);

const formatSelect = (properties, geomColName) => properties == undefined ? 'c.*,c.ROWID as ROWID ' : ["c.ROWID as ROWID", geomColName, properties].filter(Boolean).join(',');

const noOptions = (options) => Object.keys(options).length > 0 && options.constructor === Object;

const getWhereStatement = (options) => noOptions(options) ? Object.entries(options).map(e => e[0] + " = '" + decodeURI(e[1]) + "'").join(" AND ") : '1=1';

const appendRthreeFilter = (whereStatement, bbox, srsId) => {
    let [minX, minY, maxX, maxY] = bbox?.split(",").map(e => Number(e))

    if (srsId != 4326) {
        const geometryTransform = new GeometryTransform(
            Projections.getWGS84Projection(),
            Projections.getProjectionForName("EPSG:" + srsId)
        )

        bbox = geometryTransform.transformBounds(minX, minY, maxX, maxY)
        return `${!whereStatement ? '' : whereStatement + ' AND '} ${bbox[2]} >= r.minx AND ${bbox[0]} <= r.maxx AND ${bbox[3]} >= r.miny AND ${bbox[1]} <= r.maxy`
    }

    return `${!whereStatement ? '' : whereStatement + ' AND '} ${maxX} >= r.minx AND ${minX} <= r.maxx AND ${maxY} >= r.miny AND ${minY} <= r.maxy`
};

const toGeoJSON = (feature, geomColName) => {
    const { [geomColName]: geom, ROWID, ...properties } = feature;

    let geoPackageGeometryData = new GeoPackageGeometryData(geom)
    let geometry = geoPackageGeometryData.getGeometry();

    if (!geometry) return;

    const srid = geoPackageGeometryData.getSrsId();

    if (srid != 4326) {
        const geometryTransform = new GeometryTransform(
            Projections.getProjectionForName("EPSG:" + srid),
            Projections.getWGS84Projection()
        )
        geometry = geometryTransform.transformGeometry(geometry)
    }

    const featureGeometry = FeatureConverter.toFeatureGeometry(geometry)

    return {
        id: ROWID,
        type: "Feature",
        geometry: featureGeometry || null,
        properties
    }
};

const convertSQLITEtype = (type) => {
    let datatype = type.match(/\w+/g);
    const datatypes = {
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
    let schemaDef = datatypes[datatype[0]] || datatypes["default"]
    if (datatype[1]) schemaDef.maxLength = Number(datatype[1])
    return schemaDef
}

const isGeometryType = type => ["POINT", "CURVE", "LINESTRING", "SURFACE", "CURVEPOLYGON", "POLYGON", "GEOMETRYCOLLECTION", "MULTISURFACE", "MULTIPOLYGON", "MULTICURVE", "MULTILINESTRING", "MULTIPOINT"].includes(type);

const partition = (array, filter) => {
    let pass = [], fail = [];
    array.forEach((e, idx, arr) => (filter(e, idx, arr) ? pass : fail).push(e));
    return [pass, fail];
}



const getItems = async (db, collectionId, limit, offset, bbox, properties, options) => {
    const { geomColName, srsId } = getGeomMetadata(db, collectionId);
    const select = formatSelect(properties, geomColName);
    let fromStatement = `${collectionId} c`;

    let whereStatement = getWhereStatement(options);
    if (bbox) {
        fromStatement = `rtree_${collectionId}_${geomColName} r LEFT JOIN ${collectionId} c ON r.id=c.ROWID`;
        whereStatement = appendRthreeFilter(whereStatement, bbox, srsId)
    }

    const sql = `
        SELECT ${select}
        FROM  ${fromStatement}
        WHERE ${whereStatement}
        LIMIT ${limit || 9999}
        OFFSET ${offset || 0}
    `;
    const features = db.prepare(sql).all();
    const geojsonfeatures = features.map(feature => toGeoJSON(feature, geomColName))

    return geojsonfeatures
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
            Projections.getProjectionForName("EPSG:" + srsId),
        );

        const geometryData = GeoPackageGeometryData.createAndWriteWithSrsId(srsId, geometryTransform.transformGeometry(geometry)).toBuffer()
        delete feature.properties[geomCol];

        const sql = `
            INSERT INTO ${collectionId}(${[...Object.keys(feature.properties), geomCol].join(",")})
            VALUES (${[...Object.keys(feature.properties).map(() => '?'), '?'].join(",")});
        `
        globalThis.db.prepare(sql).run(Object.values(feature.properties), geometryData);

        //TODO: add update of gpkg_content metadata last_change, bbox + spatialindex

    }

    return {}
};


const getItem = async (db, collectionId, featureId) => {
    const { geomCol } = db.prepare('SELECT column_name as geomCol FROM gpkg_geometry_columns WHERE table_name=?').get(collectionId);

    const feature = db.prepare(`SELECT *,ROWID as ROWID FROM ${collectionId} WHERE ROWID=?`).get(featureId);

    if (!feature) return;
    return toGeoJSON(feature, geomCol)
};


const getSchema = (db, collectionId) => {

    let table_info = db.prepare(`SELECT name, type FROM pragma_table_info('${collectionId}')`).all()

    let [geometryType, properties] = partition(table_info, column => isGeometryType(column.type));

    properties = properties.reduce((next, column) => {
        return { ...next, [column.name]: { title: column.name, ...convertSQLITEtype(column.type) } };
    }, {})

    geometryType = table_info.filter(column => isGeometryType(column.type))[0].type;

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