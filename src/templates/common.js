const landingPage = baseurl => ({
        title: "OGC API",
        description: "",
        links: [
            {
                rel: "self",
                type: "application/json",
                title: "This document",
                href: baseurl + "?f=json",
            },
            {
                rel: "alternate",
                type: "text/html",
                title: "This document",
                href: baseurl + "?f=html",
            },
            {
                rel: "conformance",
                type: "application/json",
                title: "OGC API conformance classes implemented by this server",
                href: baseurl + "/conformance?f=json",
            },
            {
                rel: "service-desc",
                type: "application/vnd.oai.openapi+json;version=3.0",
                title: "OpenAPI 3.0 Definition of the API in json",
                href: baseurl + "/api?f=json",
            },
            {
                rel: "service-doc",
                type: "text/html",
                title: "Documentation of the API",
                href: baseurl + "/api?f=html",
            },
            {
                href: baseurl + "/collections?f=json",
                rel: "data",
                type: "application/json",
                title: "Information about the feature collections",
            },
            {
                rel: "data",
                type: "text/html",
                title: "Information about the feature collections",
                href: baseurl + "/collections?f=html",
            },
        ],
    });


const conformance= () => ({
      conformsTo: [
        "http://www.opengis.net/spec/ogcapi-common-1/1.0/req/core",
        "http://www.opengis.net/spec/ogcapi-common-1/1.0/req/landing-page",
        "http://www.opengis.net/spec/ogcapi-common-1/1.0/req/oas30",
        "http://www.opengis.net/spec/ogcapi-common-1/1.0/req/html",
        "http://www.opengis.net/spec/ogcapi-common-1/1.0/req/json",

        "http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/core",
        "http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/html",
        "http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/geojson",
        "http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/oas30",


        "http://www.opengis.net/spec/ogcapi-tiles-1/1.0/conf/core",
        "http://www.opengis.net/spec/ogcapi-tiles-1/1.0/conf/tileset",
        "http://www.opengis.net/spec/ogcapi-tiles-1/1.0/conf/tilesets-list",
        "http://www.opengis.net/spec/ogcapi-tiles-1/1.0/conf/collections-selection", 
        "http://www.opengis.net/spec/ogcapi-tiles-1/1.0/conf/oas30",
        "http://www.opengis.net/spec/ogcapi-tiles-1/1.0/conf/png",
        "http://www.opengis.net/spec/ogcapi-tiles-1/1.0/conf/jpeg",
        "http://www.opengis.net/spec/ogcapi-tiles-1/1.0/conf/mvt",
      ],
    });

  const collections = (baseurl, collections) => ({
      links: [
        {
          href: baseurl + "/collections?f=json",
          rel: "self",
          type: "application/json",
          title: "this document",
        },
        {
          href: baseurl + "/collections?f=html",
          rel: "alternate",
          type: "text/html",
          title: "this document as HTML",
        },
      ],
      collections: collections,
  });

  const collection = (baseurl, collection) => {
    const {name, data_type, identifier, description, last_change, min_x, min_y, max_x, max_y, srs_id }= collection
    const itemType = {
      "2d-gridded-coverage": "map",
      "tiles": "map",
      "features": "vector",
      "vector-tiles": "vector"
    }

    let template = {
      id: name,
      title: identifier,
      description: description,
      extent: {
        spatial: {
          bbox: [[min_x || 0, min_y || 0], [max_x || 0, max_y || 0]],
          crs: "http://www.opengis.net/def/crs/EPSG/0/"+srs_id
        },
        temporal: {
          interval: [
            [
              last_change,
              ""
            ]
          ],
          trs: "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian",
        }
      },
      crs: "http://www.opengis.net/def/crs/EPSG/0/"+srs_id,
      itemType: itemType[data_type],
      links: [
        {
          href: baseurl + "/collections/" + name + "?f=json",
          rel: "self",
          type: "application/json",
          title: "this document",
        }, {
          href: baseurl + "/collections/" + name + "?f=html",
          rel: "alternate",
          type: "text/html",
          title: "this document as HTML",
        }
      ],
    };

    if (data_type == "features") template.links = template.links.concat([{
      href: baseurl + "/collections/" + name + "/items?f=html",
      rel: "items",
      type: "text/html",
      title: "Items in the collection as HTML",
    },
    {
      href: baseurl + "/collections/" + name + "/items?f=json",
      rel: "items",
      type: "application/geo+json",
      title: "Items in the collection",
    },
    {
      href: baseurl + "/collections/" + name + "/tiles?f=html",
      rel: "tiles",
      type: "text/html",
      title: "Items in the collection as HTML",
    },
    {
      href: baseurl + "/collections/" + name + "/tiles?f=json",
      rel: "tiles",
      type: "application/geo+json",
      title: "Items in the collection"
    },
    ]);

    if (data_type == "tiles") template.links = template.links.concat([
    {
      href: baseurl + "/collections/" + name + "/map/tiles?f=html",
      rel: "maptiles",
      type: "text/html",
      title: "Tiles in the collection",
    }, {
      href: baseurl + "/collections/" + name + "/map/tiles?f=json",
      rel: "maptiles",
      type: "application/json",
      title: "Tiles in the collection",
    },{
      href: baseurl + "/collections/" + name + "/map/tiles/"+name+"/{tileMatrix}/{tileRow}/{tileCol}",
      rel: "item",
      type: "image/*",
      title: "Specific tile from the collection",
      templated: true
    }]);

    if (data_type == "vector-tiles") template.links = template.links.concat([{
      href: baseurl + "/collections/" + name + "/tiles",
      rel: "tiles",
      type: "application/json",
      title: "tiles in the collection",
    }, {
      href: baseurl + "/collections/" + name + "/tiles/WebMercatorQuad/{tileMatrix}/{tileRow}/{tileCol}",
      rel: "item",
      type: "application/vnd.mapbox-vector-tile",
      title: "specific tile from the collection",
      templated: true
    }]);
    return template;
  };

export { 
    landingPage,
    conformance,
    collection,
    collections
 }