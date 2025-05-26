import { GeoPackageGeometryData } from '@ngageoint/geopackage'
import { Projections } from '@ngageoint/projections-js'
import { GeometryTransform } from '@ngageoint/simple-features-proj-js'
import { FeatureConverter } from '@ngageoint/simple-features-geojson-js'

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


export {
    formatSelect,
    getWhereStatement,
    appendRthreeFilter,
    toGeoJSON,
    convertSQLITEtype,
    isGeometryType,
    partition
}