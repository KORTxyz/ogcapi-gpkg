const styles = (baseurl, styles) => ({
    default: styles[0]?.style || null,
    styles: styles.map(style =>
    ({
        id: style.style,
        title: style.description,
        links: [{
            rel: "stylesheet",
            title: "Style in format 'Mapbox'",
            type: "application/vnd.mapbox.style+json",
            href: baseurl + "/styles/" + style.style + "?f=mbs"
        }, {
            rel: "stylesheet",
            title: "Style in format 'HTML'",
            type: "application/vnd.qgis.qml",
            href: baseurl + "/styles/" + style.style + "?f=hmtl"
        }]
    })
    ),
    links: [
        {
            rel: "self",
            type: "application/json",
            title: "This document",
            href: baseurl + "/styles?f=json",
        },
        {
            rel: "alternate",
            type: "text/html",
            title: "This document",
            href: baseurl + "/styles?f=html",
        }
    ]
});

const emptyStylesheet = () => ({
    version: 8,
    name: "Empty",
    sources: {},
    layers: []
});


const collectionStyles = (baseurl, collectionId, styles) => ({
    default: styles.find(style => style.useAsDefault == 1).styleName,
    styles: styles.map(style =>
    ({
        id: style.styleName,
        title: style.description,
        links: [{
            rel: "stylesheet",
            title: "Style in format 'Mapbox'",
            type: "application/vnd.mapbox.style+json",
            href: baseurl + "/collections/" + collectionId + "/styles/" + style.styleName + "?f=mbs"
        }, {
            rel: "stylesheet",
            title: "Style in format 'QML'",
            type: "application/vnd.qgis.qml",
            href: baseurl + "/collections/" + collectionId + "/styles/" + style.styleName + "?f=qml"
        }, {
            rel: "stylesheet",
            title: "Style in format 'SLD'",
            type: "application/vnd.ogc.SLD",
            href: baseurl + "/collections/" + collectionId + "/styles/" + style.styleName + "?f=sld"
        }]
    })
    ),
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
});

const resources = (baseurl, resources) => ({
    "links": [
        {
            "rel": "self",
            "type": "application/json",
            "title": "This document",
            "href": `${baseurl}/resources?f=json`
        },
        {
            "rel": "alternate",
            "type": "text/html",
            "title": "This document as HTML",
            "href": `${baseurl}/resources?f=html`
        }
    ],
    "resources": resources.map(resource => ({
        "id": resource.symbol,
        "link": {
            "rel": "item",
            "title": resource.symbol,
            "type": resource.format,
            "href": `${baseurl}/resources/${resource.symbol}`
        }
    }))

});

export {
    styles,
    collectionStyles,
    resources,

    emptyStylesheet

}