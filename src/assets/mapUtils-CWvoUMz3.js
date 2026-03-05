import { a as maplibreGlExports } from './maplibre-gl-PIIsPM4H.js';

var popup = new maplibreGlExports.Popup({
    closeButton: true,
    closeOnClick: false,
    maxWidth: '100%'
});
function displayValue(value, propName) {
    if (propName === '@timestamp') {
        return value.toString() + "<br>[ " + (new Date(value * 1000)).toISOString() + " ]";
    }
    if (typeof value === 'undefined' || value === null)
        return value;
    if (typeof value === 'object' ||
        typeof value === 'number' ||
        typeof value === 'string')
        return value.toString();
    return value;
}
function renderProperty(propertyName, property) {
    return '<div class="mbview_property">' +
        '<div class="mbview_property-name">' + propertyName + '</div>' +
        '<div class="mbview_property-value">' + displayValue(property, propertyName) + '</div>' +
        '</div>';
}
function renderLayer(layerId) {
    return '<div class="mbview_layer">' + layerId + '</div>';
}
function renderProperties(feature) {
    var sourceProperty = renderLayer(feature.layer['source-layer'] || feature.layer.source);
    var idProperty = renderProperty('$id', feature.id);
    var typeProperty = renderProperty('$type', feature.geometry.type);
    var styleidProperty = renderProperty('$layername', feature.layer.id);
    var properties = Object.keys(feature.properties).map(function (propertyName) {
        return renderProperty(propertyName, feature.properties[propertyName]);
    });
    return (feature.id ? [sourceProperty, idProperty, typeProperty, styleidProperty]
        : [sourceProperty, typeProperty]).concat(properties).join('');
}
function getUniqueFeatures(features) {
    const uniqueIds = new Set();
    const uniqueFeatures = [];
    for (const feature of features) {
        const id = feature.id + feature.sourceLayer;
        if (!uniqueIds.has(id)) {
            uniqueIds.add(id);
            uniqueFeatures.push(feature);
        }
    }
    return uniqueFeatures;
}
function renderFeatures(features) {
    const uniqueFeatures = getUniqueFeatures(features);
    return uniqueFeatures.map(function (ft) {
        return '<div class="mbview_feature">' + renderProperties(ft) + '</div>';
    }).join('');
}
function renderPopup(features) {
    return '<div class="mbview_popup">' + renderFeatures(features) + '</div>';
}
function initHoverPopup(map) {
    map.on('mousemove', (e) => {
        // set a bbox around the pointer
        var selectThreshold = 1;
        const queryBox = [
            [
                e.point.x - selectThreshold,
                e.point.y + selectThreshold
            ], // bottom left (SW)
            [
                e.point.x + selectThreshold,
                e.point.y - selectThreshold
            ] // top right (NE)
        ];
        var features = map.queryRenderedFeatures(queryBox) || [];
        map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
        if (!features.length) {
            popup.remove();
        }
        else {
            popup.setLngLat(e.lngLat)
                .setHTML(renderPopup(features))
                .addTo(map);
        }
    });
}
;
function syncMaps(...maps) {
    // Create all the movement functions, because if they're created every time
    // they wouldn't be the same and couldn't be removed.
    let fns = [];
    maps.forEach((map, index) => {
        // When one map moves, we turn off the movement listeners
        // on all the maps, move it, then turn the listeners on again
        fns[index] = () => {
            off();
            const center = map.getCenter();
            const zoom = map.getZoom();
            const bearing = map.getBearing();
            const pitch = map.getPitch();
            const clones = maps.filter((_, i) => i !== index);
            clones.forEach((clone) => {
                clone.jumpTo({
                    center: center,
                    zoom: zoom,
                    bearing: bearing,
                    pitch: pitch,
                });
            });
            on();
        };
    });
    const on = () => {
        maps.forEach((map, index) => {
            map.on("move", fns[index]);
        });
    };
    const off = () => {
        maps.forEach((map, index) => {
            map.off("move", fns[index]);
        });
    };
    on();
    return () => {
        off();
        fns = [];
        maps = [];
    };
}

export { initHoverPopup as i, renderPopup as r, syncMaps as s };
//# sourceMappingURL=mapUtils-CWvoUMz3.js.map

//# sourceMappingURL=mapUtils-CWvoUMz3.js.map