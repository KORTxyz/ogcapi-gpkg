import { r as registerInstance, a as createEvent, d as getElement } from './index-DoE5X9BW.js';
import { a as maplibreGlExports } from './maplibre-gl-PIIsPM4H.js';
import { r as renderPopup } from './mapUtils-CWvoUMz3.js';
import { i as isNumber, d as degreesToRadians, r as radiansToLength, f as featureEach, b as bbox } from './index-D15Vjt1c.js';
import './_commonjsHelpers-Cf5sKic0.js';

// index.ts
function clone(geojson) {
  if (!geojson) {
    throw new Error("geojson is required");
  }
  switch (geojson.type) {
    case "Feature":
      return cloneFeature(geojson);
    case "FeatureCollection":
      return cloneFeatureCollection(geojson);
    case "Point":
    case "LineString":
    case "Polygon":
    case "MultiPoint":
    case "MultiLineString":
    case "MultiPolygon":
    case "GeometryCollection":
      return cloneGeometry(geojson);
    default:
      throw new Error("unknown GeoJSON type");
  }
}
function cloneFeature(geojson) {
  const cloned = { type: "Feature" };
  Object.keys(geojson).forEach((key) => {
    switch (key) {
      case "type":
      case "properties":
      case "geometry":
        return;
      default:
        cloned[key] = geojson[key];
    }
  });
  cloned.properties = cloneProperties(geojson.properties);
  if (geojson.geometry == null) {
    cloned.geometry = null;
  } else {
    cloned.geometry = cloneGeometry(geojson.geometry);
  }
  return cloned;
}
function cloneProperties(properties) {
  const cloned = {};
  if (!properties) {
    return cloned;
  }
  Object.keys(properties).forEach((key) => {
    const value = properties[key];
    if (typeof value === "object") {
      if (value === null) {
        cloned[key] = null;
      } else if (Array.isArray(value)) {
        cloned[key] = value.map((item) => {
          return item;
        });
      } else {
        cloned[key] = cloneProperties(value);
      }
    } else {
      cloned[key] = value;
    }
  });
  return cloned;
}
function cloneFeatureCollection(geojson) {
  const cloned = { type: "FeatureCollection" };
  Object.keys(geojson).forEach((key) => {
    switch (key) {
      case "type":
      case "features":
        return;
      default:
        cloned[key] = geojson[key];
    }
  });
  cloned.features = geojson.features.map((feature) => {
    return cloneFeature(feature);
  });
  return cloned;
}
function cloneGeometry(geometry) {
  const geom = { type: geometry.type };
  if (geometry.bbox) {
    geom.bbox = geometry.bbox;
  }
  if (geometry.type === "GeometryCollection") {
    geom.geometries = geometry.geometries.map((g) => {
      return cloneGeometry(g);
    });
    return geom;
  }
  geom.coordinates = deepSlice(geometry.coordinates);
  return geom;
}
function deepSlice(coords) {
  const cloned = coords;
  if (typeof cloned[0] !== "object") {
    return cloned.slice();
  }
  return cloned.map((coord) => {
    return deepSlice(coord);
  });
}
var turf_clone_default = clone;

// index.ts
function getCoord(coord) {
  if (!coord) {
    throw new Error("coord is required");
  }
  if (!Array.isArray(coord)) {
    if (coord.type === "Feature" && coord.geometry !== null && coord.geometry.type === "Point") {
      return [...coord.geometry.coordinates];
    }
    if (coord.type === "Point") {
      return [...coord.coordinates];
    }
  }
  if (Array.isArray(coord) && coord.length >= 2 && !Array.isArray(coord[0]) && !Array.isArray(coord[1])) {
    return [...coord];
  }
  throw new Error("coord must be GeoJSON Point or an Array of numbers");
}
function getCoords(coords) {
  if (Array.isArray(coords)) {
    return coords;
  }
  if (coords.type === "Feature") {
    if (coords.geometry !== null) {
      return coords.geometry.coordinates;
    }
  } else {
    if (coords.coordinates) {
      return coords.coordinates;
    }
  }
  throw new Error(
    "coords must be GeoJSON Feature, Geometry Object or an Array"
  );
}
function containsNumber(coordinates) {
  if (coordinates.length > 1 && isNumber(coordinates[0]) && isNumber(coordinates[1])) {
    return true;
  }
  if (Array.isArray(coordinates[0]) && coordinates[0].length) {
    return containsNumber(coordinates[0]);
  }
  throw new Error("coordinates must only contain numbers");
}
function geojsonType(value, type, name) {
  if (!type || !name) {
    throw new Error("type and name required");
  }
  if (!value || value.type !== type) {
    throw new Error(
      "Invalid input to " + name + ": must be a " + type + ", given " + value.type
    );
  }
}
function featureOf(feature, type, name) {
  if (!feature) {
    throw new Error("No feature passed");
  }
  if (!name) {
    throw new Error(".featureOf() requires a name");
  }
  if (!feature || feature.type !== "Feature" || !feature.geometry) {
    throw new Error(
      "Invalid input to " + name + ", Feature with geometry required"
    );
  }
  if (!feature.geometry || feature.geometry.type !== type) {
    throw new Error(
      "Invalid input to " + name + ": must be a " + type + ", given " + feature.geometry.type
    );
  }
}
function collectionOf(featureCollection, type, name) {
  if (!featureCollection) {
    throw new Error("No featureCollection passed");
  }
  if (!name) {
    throw new Error(".collectionOf() requires a name");
  }
  if (!featureCollection || featureCollection.type !== "FeatureCollection") {
    throw new Error(
      "Invalid input to " + name + ", FeatureCollection required"
    );
  }
  for (const feature of featureCollection.features) {
    if (!feature || feature.type !== "Feature" || !feature.geometry) {
      throw new Error(
        "Invalid input to " + name + ", Feature with geometry required"
      );
    }
    if (!feature.geometry || feature.geometry.type !== type) {
      throw new Error(
        "Invalid input to " + name + ": must be a " + type + ", given " + feature.geometry.type
      );
    }
  }
}
function getGeom(geojson) {
  if (geojson.type === "Feature") {
    return geojson.geometry;
  }
  return geojson;
}
function getType(geojson, _name) {
  if (geojson.type === "FeatureCollection") {
    return "FeatureCollection";
  }
  if (geojson.type === "GeometryCollection") {
    return "GeometryCollection";
  }
  if (geojson.type === "Feature" && geojson.geometry !== null) {
    return geojson.geometry.type;
  }
  return geojson.type;
}

// index.ts
function distance(from, to, options = {}) {
  var coordinates1 = getCoord(from);
  var coordinates2 = getCoord(to);
  var dLat = degreesToRadians(coordinates2[1] - coordinates1[1]);
  var dLon = degreesToRadians(coordinates2[0] - coordinates1[0]);
  var lat1 = degreesToRadians(coordinates1[1]);
  var lat2 = degreesToRadians(coordinates2[1]);
  var a = Math.pow(Math.sin(dLat / 2), 2) + Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);
  return radiansToLength(
    2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)),
    options.units
  );
}
var turf_distance_default = distance;

var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
function nearestPoint(targetPoint, points, options = {}) {
  if (!targetPoint) throw new Error("targetPoint is required");
  if (!points) throw new Error("points is required");
  let minDist = Infinity;
  let bestFeatureIndex = 0;
  featureEach(points, (pt, featureIndex) => {
    const distanceToPoint = distance(targetPoint, pt, options);
    if (distanceToPoint < minDist) {
      bestFeatureIndex = featureIndex;
      minDist = distanceToPoint;
    }
  });
  const nearestPoint2 = clone(points.features[bestFeatureIndex]);
  return __spreadProps(__spreadValues({}, nearestPoint2), {
    properties: __spreadProps(__spreadValues({}, nearestPoint2.properties), {
      featureIndex: bestFeatureIndex,
      distanceToPoint: minDist
    })
  });
}
var turf_nearest_point_default = nearestPoint;

const KortxyzMaplibreLayer = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.featureClicked = createEvent(this, "featureClicked", 7);
    }
    get el() { return getElement(this); }
    map;
    popupEl = new maplibreGlExports.Popup({
        closeButton: true,
        closeOnClick: true,
        maxWidth: 'none'
    });
    /** Layer identification.  */
    layerid = Math.random().toString(36).substring(2, 7);
    /** Layer to use from a vector tile source. Required for vector tile sources; prohibited for all other source types, including GeoJSON sources.  */
    sourceLayer;
    /** Type of layer */
    type = 'fill';
    /** Expression to fitler the layer */
    filter;
    /** Paint properties for the layer. */
    paint = {};
    /** Layout properties for the layer. */
    layout = {};
    /** Customize legend with a object like this {name:string,unit:string,labels:object (Map a value to a text that replaces it as a label) }*/
    legendMetadata = {};
    /** (optional) When clicking a feature a Popup shows. Accept HTML and replacement of {} with a attribute. \<div>{placename}\</div>*/
    popup;
    /** (optional) When clicking a feature a new webpage is opened with the link prop. {} can be used to replace with a attribute. https://mypage.org/{ATTRIBUTENAME} */
    clicklink;
    /** (optional) Distance to a GPS Fix that wil trigger the popup, disables clickbased popup*/
    proximity;
    /** Emit the ID of the first feature clicked */
    featureClicked;
    rowClickedHandler(event) {
        const parentEl = this.el.parentElement;
        if (event.detail.store == parentEl.store && ['circle', 'line', 'fill'].includes(this.type)) {
            const coords = (([x1, y1, x2, y2]) => [[x1, y1], [x2, y2]])(bbox(event.detail.geometry));
            this.map.fitBounds(coords, {
                linear: true,
                padding: 100,
                maxZoom: 16
            });
            const paintProperties = this.map.getPaintProperty(this.layerid, this.type + '-color');
            this.map.setPaintProperty(this.layerid, this.type + '-color', [
                'match', ["id"],
                event.detail.id, 'yellow',
                paintProperties
            ]);
            setTimeout(() => {
                this.map.setPaintProperty(this.layerid, this.type + '-color', this.paint[this.type + '-color']);
            }, 600);
        }
    }
    openPopup = async (e) => {
        const feature = e.features[0];
        this.featureClicked.emit(feature.id);
        const popupHtml = typeof this.popup === "string" && this.popup.length > 0
            ? this.popup.replace(/{(\w+)}/g, (_, k) => feature.properties[k] || "")
            : renderPopup([feature]);
        this.popupEl
            .setLngLat(e.lngLat)
            .setHTML(popupHtml)
            .addTo(this.map);
    };
    initPopupLayer() {
        this.map.on('mouseenter', this.layerid, () => this.map.getCanvas().style.cursor = 'pointer');
        this.map.on('mouseleave', this.layerid, () => this.map.getCanvas().style.cursor = '');
        this.map.on('click', this.layerid, e => this.openPopup(e));
    }
    async addLayer(layerObject) {
        const layerElInDom = document.getElementsByTagName("kortxyz-maplibre-layer");
        const layerIdsAsList = [...layerElInDom].map(e => e.layerid);
        const beforeId = layerIdsAsList[layerIdsAsList.findIndex(e => e == this.layerid) - 1];
        if (beforeId != undefined) {
            while (this.map.getLayer(beforeId) == undefined) {
                await new Promise(r => setTimeout(r, 200));
            }
        }
        this.map.addLayer(layerObject, beforeId);
    }
    async componentWillLoad() {
        this.paint = typeof this.paint == "string" ? JSON.parse(this.paint) : this.paint;
        this.layout = typeof this.layout == "string" ? JSON.parse(this.layout) : this.layout;
        this.legendMetadata = typeof this.legendMetadata == "string" ? JSON.parse(this.legendMetadata) : this.legendMetadata;
    }
    async componentDidLoad() {
        const { map } = this.el.closest('kortxyz-maplibre');
        this.map = map;
        const { sourceid } = this.el.closest('kortxyz-maplibre-source');
        let layerObject = {
            'id': this.layerid,
            'type': this.type,
            'source': sourceid,
            'paint': this.paint,
            'layout': this.layout,
            'metadata': this.legendMetadata,
        };
        if (this.sourceLayer)
            layerObject["source-layer"] = this.sourceLayer;
        if (this.filter)
            layerObject["filter"] = JSON.parse(this.filter);
        if (this.popup != undefined && this.proximity == undefined)
            this.initPopupLayer();
        if (this.clicklink != undefined) {
            this.map.on('mouseenter', this.layerid, () => this.map.getCanvas().style.cursor = 'pointer');
            this.map.on('mouseleave', this.layerid, () => this.map.getCanvas().style.cursor = '');
            map.on('click', this.layerid, (e) => {
                this.featureClicked.emit(e.features[0].id);
                const link = String(this.clicklink).replace(/{(\w+)}/g, (_, k) => e.features[0].properties[k]);
                if (link)
                    window.open(link, '_blank');
            });
        }
        if (this.proximity) {
            window.addEventListener('gpsFix', ({ detail }) => {
                const { longitude, latitude, accuracy } = detail.coords;
                const { data: points } = map.getSource(sourceid).serialize();
                const targetPoints = {
                    ...points,
                    features: points.features.flatMap(feature => feature.geometry.type === 'MultiPoint' ?
                        feature.geometry.coordinates.map(coords => ({ ...feature, geometry: { type: 'Point', coordinates: coords } })) :
                        feature)
                };
                let nearest = nearestPoint([longitude, latitude], targetPoints, { units: 'meters' });
                if (nearest.properties.distanceToPoint < this.proximity && accuracy < 20) {
                    nearest.properties = {
                        id: nearest.id,
                        ...nearest.properties,
                        ...detail.coords,
                        timestamp: detail.timestamp,
                        lng: longitude,
                        lat: latitude
                    };
                    this.openPopup({
                        lngLat: nearest.geometry.coordinates,
                        features: [{ ...nearest, layer: { source: sourceid } }]
                    });
                }
            });
        }
        while (map.getSource(sourceid) == undefined)
            await new Promise(r => setTimeout(r, 100));
        this.addLayer(layerObject);
    }
};

export { KortxyzMaplibreLayer as kortxyz_maplibre_layer };
//# sourceMappingURL=kortxyz-maplibre-layer.entry.esm.js.map
