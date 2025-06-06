import SldStyleParser from '@kortxyz/geostyler-sld-parser-esm';
import MapboxStyleParser from '@kortxyz/geostyler-mapbox-parser';

import { Projections } from "@ngageoint/projections-js";

const parser = new SldStyleParser();
parser.sldVersion = '1.1.0'
const mbParser = new MapboxStyleParser();

import { getCollectionStylesheet } from '../database/styles.js';
import { getCollection } from '../database/common.js';
import { collectionMapTileSet } from '../templates/tiles.js';
import { getTileMatrixSetLimits, getVectorTilesSpec } from '../database/tiles.js';

const layerColor = () => ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', '#ffff99'][Math.random() * 11 | 0]

const getBboxZoom = (bbox) => {
    const MAX_ZOOM = 14;
    for (let z = 0; z < MAX_ZOOM; z++) {
        const mask = 1 << (32 - (z + 1));
        if ((bbox[0] & mask) !== (bbox[2] & mask) ||
            (bbox[1] & mask) !== (bbox[3] & mask)) {
            return z;
        }
    }
    return MAX_ZOOM;
}

const convertBBOXtoWGS84 = (srs_id, min_x, min_y, max_x, max_y) => {
    const storageProjection = Projections.getProjectionForName("EPSG:" + srs_id);
    const wgs84Projection = Projections.getProjectionForName("EPSG:4326");
    const transformation = Projections.getProjectionTransformation(storageProjection, wgs84Projection);

    return [...transformation.transformCoordinateArray([min_x, min_y]), ...transformation.transformCoordinateArray([max_x, max_y])]
}



const generateMapStylesheet = (db, baseurl, collectionId, collection) => {

    const { boundingBox, centerPoint, links } = collectionMapTileSet(baseurl, collection);

    const tileMatrixSetLimits = getTileMatrixSetLimits(db, collectionId)
    const zoomlevels = tileMatrixSetLimits.map(e => e.tileMatrix)
    const maxZoom = Math.max(...zoomlevels)
    const minZoom = Math.min(...zoomlevels)
    return {
        "version": 8,
        "name": "default",
        "center": centerPoint.coordinates.reverse(),
        "zoom": (maxZoom - minZoom) / 2 + minZoom,
        "sources": {
            "collection-tiles": {
                "type": "raster",
                "tileSize": 256,
                "minzoom": minZoom,
                "maxzoom": maxZoom,
                "bounds": [...boundingBox.lowerLeft.reverse(), ...boundingBox.upperRight.reverse()],
                "tiles": [
                    links.find(link => link.rel == "item").href
                        .replace("{tileMatrix}", "{z}")
                        .replace("{tileRow}", "{x}")
                        .replace("{tileCol}", "{y}")
                ]
            }
        },
        "layers": [
            {
                "id": "raster",
                "type": "raster",
                "source": "collection-tiles"
            },
        ]
    }
};

const generateMapboxLayerStyle = (name, minzoom, maxzoom) => ([
    {
        'id': name + '-polygons',
        'type': 'fill',
        "source": "collection-tiles",
        'source-layer': name,
        'filter': ["==", "$type", "Polygon"],
        'layout': {},
        'paint': {
            'fill-opacity': ["case", ["boolean", ["feature-state", "hover"], false], 0.8, 0.4],
            'fill-color': layerColor()
        }
    }, {
        'id': name + '-polygons-outline',
        'type': 'line',
        "source": "collection-tiles",
        'source-layer': name,
        'filter': ["==", "$type", "Polygon"],
        'layout': {
            'line-join': 'round',
            'line-cap': 'round'
        },
        'paint': {
            'line-color': layerColor(),
            'line-width': 1,
            'line-opacity': 0.7
        }
    }, {
        'id': name + '-lines',
        'type': 'line',
        "source": "collection-tiles",
        'source-layer': name,
        'filter': ["==", "$type", "LineString"],
        'layout': {
            'line-join': 'round',
            'line-cap': 'round'
        },
        'paint': {
            'line-color': layerColor(),
            'line-width': 1,
            'line-opacity': ["case", ["boolean", ["feature-state", "hover"], false], 0.8, 0.4]
        }
    }, {
        'id': name + '-pts',
        'type': 'circle',
        "source": "collection-tiles",
        'source-layer': name,
        'filter': ["==", "$type", "Point"],
        'paint': {
            'circle-color': layerColor(),
            'circle-radius': 2.5,
            'circle-opacity': ["case", ["boolean", ["feature-state", "hover"], false], 0.8, 0.4]
        }
    }
]);



const generateVectortilesStylesheet = (db, baseurl, collectionId, collection) => {
    const { name } = collection;

    let { srs_id, min_x, min_y, max_x, max_y } = getCollection(db, collectionId)
    if (srs_id !== 4326) [min_x, min_y, max_x, max_y] = convertBBOXtoWGS84(srs_id, min_x, min_y, max_x, max_y)

    const layers = getVectorTilesSpec(db, collectionId).map(layer => generateMapboxLayerStyle(layer.id, layer.minTileMatrix, layer.maxTileMatrix)).flat()

    return {
        "version": 8,
        "name": name,
        "center": [
            (max_x + min_x) / 2,
            (max_y + min_y) / 2,
        ],
        "zoom": getBboxZoom([min_x, min_y, max_x, max_y]),
        "metadata": {
            "mapbox:autocomposite": true,
            "mapbox:type": "template"
        },
        "sources": {
            "collection-tiles": {
                "type": "vector",
                "tileSize": 512,
                "maxzoom": 14,
                "tiles": [
                    baseurl + "/collections/" + collectionId + "/tiles/WebMercatorQuad/{z}/{y}/{x}"
                ]
            }
        },
        "layers": [
            {
                "id": "background",
                "type": "background",
                "paint": {
                    "background-color": "grey"
                }
            },
            ...layers
        ]
    }
};

const generateVectorStylesheet = (db, baseurl, collectionId, collection) => {

    const { name } = collection;

    let { min_x, min_y, max_x, max_y, srs_id } = getCollection(db, collectionId)
    if (srs_id !== 4326) [min_x, min_y, max_x, max_y] = convertBBOXtoWGS84(srs_id, min_x, min_y, max_x, max_y)


    return {
        "version": 8,
        "name": name,
        "center": [
            (max_x + min_x) / 2,
            (max_y + min_y) / 2,
        ],
        "zoom": Math.max(getBboxZoom([min_x, min_y, max_x, max_y]), 9),
        "metadata": {
            "mapbox:autocomposite": true,
            "mapbox:type": "template"
        },
        "sources": {
            "collection-tiles": {
                "type": "vector",
                "tileSize": 512,
                "maxzoom": 18,
                "tiles": [
                    baseurl + "/collections/" + collectionId + "/tiles/WebMercatorQuad/{z}/{x}/{y}"
                ]
            }
        },
        "layers": [
            {
                "id": "background",
                "type": "background",
                "paint": {
                    "background-color": "grey"
                }
            },
            ...generateMapboxLayerStyle(name)
        ]
    }
};


const generateCollectionStyles = (baseurl, collectionId) => ({
    default: "default",
    styles: [{
        id: "default",
        title: "Autogenerated default style for " + collectionId + ".",
        links: [{
            rel: "stylesheet",
            title: "Style in format 'Mapbox'",
            type: "application/vnd.mapbox.style+json",
            href: baseurl + "/collections/" + collectionId + "/styles/default?f=mbs"
        }, {
            rel: "stylesheet",
            title: "Style in format 'QML'",
            type: "application/vnd.qgis.qml",
            href: baseurl + "/collections/" + collectionId + "/styles/default?f=qml"
        }, {
            rel: "stylesheet",
            title: "Style in format 'SLD'",
            type: "application/vnd.ogc.SLD",
            href: baseurl + "/collections/" + collectionId + "/styles/default?f=sld"
        }]
    }],
    links: [
        {
            rel: "self",
            type: "application/json",
            title: "This document",
            href: baseurl + "/collections/" + collectionId + "/styles?f=json",
        },
        {
            rel: "alternate",
            type: "text/html",
            title: "This document",
            href: baseurl + "/collections/" + collectionId + "/styles?f=html",
        }
    ]
})


const generateDefaultStylesheet = (db, baseurl, collectionId) => {
    const collection = getCollection(db, collectionId);
    if (collection.data_type == "tiles") return generateMapStylesheet(db, baseurl, collectionId, collection);
    if (collection.data_type == "vector-tiles") return generateVectortilesStylesheet(db, baseurl, collectionId, collection);

    else return generateVectorStylesheet(db, baseurl, collectionId, collection)
};


const convertStyleToMBS = async (baseurl, db, collectionId, styleId) => {

    let { min_x, min_y, max_x, max_y, srs_id } = getCollection(db, collectionId)
    if (srs_id !== 4326) [min_x, min_y, max_x, max_y] = convertBBOXtoWGS84(srs_id, min_x, min_y, max_x, max_y)

    const SLDsheet = getCollectionStylesheet(db, collectionId, styleId, "SLD");
    if (!SLDsheet) return;

    const { output: style } = await parser.readStyle(SLDsheet)
    let { layers } = mbParser.geoStylerStyleToMapboxObject(style)

    layers = layers.map(layer => ({
        ...layer,
        "source": "collection-tiles",
        "source-layer": collectionId
    }))

    return {
        "version": 8,
        "name": styleId,
        "center": [
            (max_x + min_x) / 2,
            (max_y + min_y) / 2,
        ],
        "zoom": 12,
        "metadata": {
            "mapbox:autocomposite": true,
            "mapbox:type": "template"
        },
        "sources": {
            "collection-tiles": {
                "type": "vector",
                "tileSize": 512,
                "maxzoom": 18,
                "tiles": [
                    baseurl + "/collections/" + collectionId + "/tiles/WebMercatorQuad/{z}/{x}/{y}"
                ]
            }
        },
        "layers": [
            ...layers
        ]
    }
};


export {
    generateCollectionStyles,
    generateDefaultStylesheet,
    convertStyleToMBS
}