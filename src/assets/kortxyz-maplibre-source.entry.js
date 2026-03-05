import { r as registerInstance, d as getElement } from './index-DoE5X9BW.js';
import { g as getStore } from './store-C9Stgfg-.js';
import { b as bbox } from './index-D15Vjt1c.js';

const KortxyzMaplibreSource = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    get el() { return getElement(this); }
    map;
    randomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    /** Source identification */
    sourceid = Math.random().toString(36).substring(2, 7);
    /** Type of source. */
    type = 'geojson';
    /** URL to the geojson source. */
    data;
    /** Datastore reference. */
    store;
    /** Url to the tilesource. e.g. https://demotiles.maplibre.org/tiles/{z}/{x}/{y}.pbf */
    tiles;
    /** Size of the tiles in px. */
    tilesize = 512;
    /** Max zoom-level to fetch tiles. z-parameter */
    maxzoom = 14;
    /** fit mapbounds to geojsonbounds  */
    fit = false;
    /** add a layer without specifing it. If no kortxyz-maplibre-layer children, it is automatically set to true.*/
    autolayers = false;
    source;
    getMapboxType = geojsonGeomType => ({
        Point: 'circle',
        MultiPoint: 'circle',
        LineString: 'line',
        MultiLineString: 'line',
        Polygon: 'fill',
        MultiPolygon: 'fill',
        GeometryCollection: 'fill'
    }[geojsonGeomType]);
    getSourceObject = () => {
        if (this.type == 'geojson') {
            let SourceSpecification = {
                'type': this.type,
                'data': {
                    'type': 'FeatureCollection',
                    'features': []
                }
            };
            return SourceSpecification;
        }
        else if (this.type == 'vector' || this.type == 'raster') {
            let SourceSpecification = {
                'type': this.type,
                'tiles': [this.tiles],
                'maxzoom': this.maxzoom,
                'tileSize': this.tilesize
            };
            return SourceSpecification;
        }
    };
    updateGeojson = async (geojson) => {
        this.source.setData(geojson);
        if (this.autolayers) {
            const geomTypeMap = geojson.features.reduce((acc, f) => ((acc[f.geometry.type] = (acc[f.geometry.type] || 0) + 1), acc), {});
            const geomTypes = Object.keys(geomTypeMap).sort((a, b) => geomTypeMap[b] - geomTypeMap[a]);
            geomTypes.forEach((geomType) => {
                const mapboxType = this.getMapboxType(geomType);
                if (this.map.getLayer(this.sourceid + "-" + geomType))
                    this.map.removeLayer(this.sourceid + "-" + geomType);
                let layerEl = document.createElement("kortxyz-maplibre-layer");
                layerEl.layerid = this.sourceid + "-" + geomType;
                layerEl.setAttribute("type", mapboxType);
                layerEl.setAttribute("paint", `{"${mapboxType}-color":"${this.randomColor()}","${mapboxType}-opacity":0.8}`);
                layerEl.setAttribute("popup", "");
                this.el.appendChild(layerEl);
            });
        }
        if (this.fit) {
            const bounds = bbox(geojson);
            this.map.fitBounds(bounds, {
                animate: false,
                padding: 100,
                maxZoom: 16
            });
        }
    };
    async addSource() {
        this.map.addSource(this.sourceid, this.getSourceObject());
        this.source = this.map.getSource(this.sourceid);
        if (this.type == "geojson") {
            let geojson;
            if (this.store) {
                let datastore;
                while ((datastore = getStore(this.store)) == undefined || !datastore.get("data").features.length)
                    await new Promise(r => setTimeout(r, 200));
                geojson = datastore.get("filtereddata");
                datastore.onChange("filtereddata", (e) => this.source.setData(e));
            }
            else {
                try {
                    const res = await fetch(this.data);
                    geojson = await res.json();
                }
                catch (err) {
                    geojson = JSON.parse(this.el.innerHTML);
                }
            }
            this.updateGeojson(geojson);
        }
        else if (this.type == "raster" && this.autolayers) {
            let layerEl = document.createElement("kortxyz-maplibre-layer");
            layerEl.id = this.sourceid + "-raster";
            layerEl.setAttribute("type", "raster");
            this.el.appendChild(layerEl);
        }
    }
    async componentWillLoad() {
        this.map = this.el.parentElement.map;
        if (this.el.children.length == 0)
            this.autolayers = true;
    }
};

export { KortxyzMaplibreSource as kortxyz_maplibre_source };
//# sourceMappingURL=kortxyz-maplibre-source.entry.esm.js.map
