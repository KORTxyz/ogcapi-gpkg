import { Projections } from '@ngageoint/projections-js'
import { GeometryTransform } from '@ngageoint/simple-features-proj-js'
import { FeatureConverter } from '@ngageoint/simple-features-geojson-js'
import { GeometryReader, GeometryWriter } from '@ngageoint/simple-features-wkb-js';

const formatSelect = (properties, primaryKey, geomColName) => properties == undefined ? 'c.*' : [ geomColName, primaryKey, properties].filter(Boolean).join(',');

const hasOptions = (options) => Object.keys(options).length > 0 && options.constructor === Object;

const getWhereStatement = (options) => hasOptions(options) ? Object.entries(options).map(e => e[0] + " = '" + decodeURI(e[1]) + "'").join(" AND ") : '1=1';

const appendRthreeFilter = (whereStatement, bbox, srsId) => {
    let [minX, minY, maxX, maxY] = bbox?.split(",").map(e => Number(e))

    if (srsId != 4326) {
        const geometryTransform = new GeometryTransform(
            Projections.getWGS84Projection(),
            Projections.getProjectionForName("EPSG:" + srsId)
        )

        bbox = geometryTransform.transformBounds(minX, minY, maxX, maxY) // [minX, minY, maxX, maxY]
        return `${!whereStatement ? '' : whereStatement + ' AND '} r.maxx >= ${bbox[0]} AND r.minx <= ${bbox[2]} AND r.maxy >= ${bbox[1]} AND r.miny <= ${bbox[3]}`;
    }
    return `${!whereStatement ? '' : whereStatement + ' AND '} r.maxx >= ${minX} AND r.minx <= ${maxX} AND r.maxy >= ${minY} AND r.miny <= ${maxY}`;
};

function getGpkgHeader(data) {
    const view = new DataView(data.buffer, data.byteOffset, data.byteLength);

    const magic1 = String.fromCharCode(view.getUint8(0));
    const magic2 = String.fromCharCode(view.getUint8(1));
    const version = view.getUint8(2);
    const flags = view.getUint8(3);
    const littleEndian = (flags & 1) === 1; // bit 0
    const srid = view.getInt32(4, littleEndian);
    const envelopeIndicator = (flags >> 1) & 0x07;

    const envelopeSizes = {
        0: 0,
        1: 32,
        2: 48,
        3: 48,
        4: 64
    };

    return {
        wkbOffset: 8 + (envelopeSizes[envelopeIndicator] || 0),
        Magic: magic1 + magic2,
        Version: version,
        Flags: flags.toString(2).padStart(8, "0"),
        srid: srid
    }
}

const toGeoJSON = (feature, primaryKey, geomColName) => {
    const { [geomColName]: geom, [primaryKey]:pk, ...properties } = feature;
    const data = geom instanceof ArrayBuffer ? new Uint8Array(geom) : geom;

    const {wkbOffset,srid} = getGpkgHeader(data)
    const wkb = data.slice(wkbOffset);
    
    let geometry = GeometryReader.readGeometry(wkb);
    if (!geometry) return;

    if (srid != 4326) {
        const geometryTransform = new GeometryTransform(
            Projections.getProjectionForName("EPSG:" + srid),
            Projections.getWGS84Projection()
        )
        geometry = geometryTransform.transformGeometry(geometry)
    }

    const featureGeometry = FeatureConverter.toFeatureGeometry(geometry)

    return {
        id: pk,
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

const isGeometryType = type => ["POINT", "CURVE", "LINESTRING", "SURFACE", "CURVEPOLYGON", "POLYGON", "GEOMETRY", "GEOMETRYCOLLECTION", "MULTISURFACE", "MULTIPOLYGON", "MULTICURVE", "MULTILINESTRING", "MULTIPOINT"].includes(type);

const partition = (array, predicate) => [
  array.filter(predicate),
  array.filter(e => !predicate(e))
];


/**
 * Encode a feature (GeoJSON-like) into GeoPackage geometry BLOB
 */
function toGPGKgeometry(feature, srsId = 4326, envelopeIndicator = 1) {
  let geometry = FeatureConverter.toSimpleFeaturesGeometry(feature);

  // Reproject if needed
  if (srsId !== 4326) {
    const geometryTransform = new GeometryTransform(
      Projections.getWGS84Projection(),
      Projections.getProjectionForName("EPSG:" + srsId)
    );
    geometry = geometryTransform.transformGeometry(geometry);
  }

  // Write WKB
  const wkb = GeometryWriter.writeGeometry(geometry);

  // ---- Build Header ----
  const littleEndian = true;

  // Envelope sizes by indicator
  const envelopeSizes = { 0: 0, 1: 32, 2: 48, 3: 48, 4: 64 };
  const envelopeSize = envelopeSizes[envelopeIndicator] || 0;

  const headerSize = 8 + envelopeSize;
  const buffer = new Uint8Array(headerSize + wkb.length);
  const view = new DataView(buffer.buffer);

  // Magic
  buffer[0] = "G".charCodeAt(0);
  buffer[1] = "P".charCodeAt(0);

  // Version
  buffer[2] = 0;

  // Flags: little endian + envelopeIndicator
  let flags = 0;
  if (littleEndian) flags |= 1; // bit 0
  flags |= (envelopeIndicator & 0x07) << 1; // bits 1–3
  buffer[3] = flags;

  // SRS ID
  view.setInt32(4, srsId, littleEndian);

  // Envelope (if requested)
  if (envelopeIndicator > 0) {
    const env = geometry.getEnvelope(); // { minX, maxX, minY, maxY, minZ?, maxZ?, minM?, maxM? }
    let offset = 8;
    view.setFloat64(offset, env.minX, littleEndian); offset += 8;
    view.setFloat64(offset, env.maxX, littleEndian); offset += 8;
    view.setFloat64(offset, env.minY, littleEndian); offset += 8;
    view.setFloat64(offset, env.maxY, littleEndian); offset += 8;

    if (envelopeIndicator === 2 || envelopeIndicator === 4) {
      view.setFloat64(offset, env.minZ ?? 0, littleEndian); offset += 8;
      view.setFloat64(offset, env.maxZ ?? 0, littleEndian); offset += 8;
    }
    if (envelopeIndicator === 3 || envelopeIndicator === 4) {
      view.setFloat64(offset, env.minM ?? 0, littleEndian); offset += 8;
      view.setFloat64(offset, env.maxM ?? 0, littleEndian); offset += 8;
    }
  }

  // Append WKB
  buffer.set(wkb, headerSize);

  return buffer;
}

export {
    formatSelect,
    getWhereStatement,
    appendRthreeFilter,
    toGeoJSON,
    toGPGKgeometry,
    convertSQLITEtype,
    isGeometryType,
    partition
}