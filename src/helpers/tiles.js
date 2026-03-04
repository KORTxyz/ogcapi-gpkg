import * as featuresModel from "../database/features.js";

import vtpbf from 'vt-pbf';
import geojsonVt from 'geojson-vt';


function tileToBBox(x, y, z) {
  const n = Math.pow(2, z);

  const west  = (x / n) * 360 - 180;
  const east  = ((x + 1) / n) * 360 - 180;

  const north = Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / n))) * (180 / Math.PI);
  const south = Math.atan(Math.sinh(Math.PI * (1 - (2 * (y + 1)) / n))) * (180 / Math.PI);

  return [west, south, east, north];
}

const isGzip = (buf) => {
    if (!buf || buf.length < 3) return false;
	return buf[0] === 0x1F && buf[1] === 0x8B && buf[2] === 0x08;
}

const getAsVectorTile = async (db, collectionId, tileMatrix, tileRow, tileCol, limit, properties) => {
    const bbox = tileToBBox(tileRow, tileCol, tileMatrix)

    const features = await featuresModel.getItems(db, collectionId, limit, 0, bbox.join(), properties, [])
    if (features?.length > 0) {
        const tileindex = geojsonVt({ type: 'FeatureCollection', features: features }, { maxZoom: 18, promoteId: Object.keys(features[0].properties)[0] })
        const tile = tileindex.getTile(Number(tileMatrix), Number(tileRow), Number(tileCol))
        if (!tile) return null;

        let Obj = {};
        Obj[collectionId] = tile;

        const pbf = vtpbf.fromGeojsonVt(Obj, { version: 2 });

        return pbf
    }
    else return null;

};

export {
    getAsVectorTile,
    isGzip
}