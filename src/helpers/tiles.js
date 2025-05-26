import * as featuresModel from "../database/features.js";

import vtpbf from 'vt-pbf';
import geojsonVt from 'geojson-vt';

import { SphericalMercator } from '@mapbox/sphericalmercator';

const merc = new SphericalMercator({
    size: 512,
    antimeridian: true
});

const getAsVectorTile = async (db, collectionId, tileMatrix, tileRow, tileCol, limit, properties) => {
    const bbox = merc.bbox(tileRow, tileCol, tileMatrix, false)

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
    getAsVectorTile
}