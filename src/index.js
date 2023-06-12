const fs = require('fs')
const path = require('path');


const getHandlers = () => {
    let handler = {};

    fs.readdirSync(path.join(__dirname, "./handlers"))
        .forEach(file => {
            const filePath = path.join(__dirname, "./handlers", file);
            const fileContent = require(filePath);
            handler = { ...handler, ...fileContent }
        })

    return handler;
};

module.exports = async (fastify, opts, done) => {
    const databasePath = opts.gpkg || process.env.gpkg || 'generated.gpkg';
    process.env.baseUrl = opts.baseUrl
    require('./helper/database').init(databasePath)

    globalThis.api = require('js-yaml').load(require('fs').readFileSync(path.join(__dirname, 'openapi.yaml')), 'utf8')
    if(opts.skipLandingpage) delete globalThis.api.paths["/"]    
    const handler = getHandlers();

    fastify.addContentTypeParser('text/html', async (request, payload) => {
      await htmlParser(payload);
    })
    fastify.addContentTypeParser('application/tilejson', async (request, payload) => {
      console.log("tilejsonParser", request,payload)
    })
    fastify.addContentTypeParser('application/geo+json', { parseAs: 'string' }, fastify.getDefaultJsonParser('ignore', 'ignore'))
    fastify.addContentTypeParser('image/*', async (request, payload) => {
      await imageParser(payload);
    })

    fastify.register(require('@fastify/static'), {
        root: path.join(__dirname, 'public'),
        prefix: '/public/',
      })

      fastify.register(require('@fastify/any-schema'), {
        schemas: [{
          $id: 'tilejson',
            "type": "object",
            "properties": {
              "tilejson": {
                "type": "string",
                "pattern": "\\d+\\.\\d+\\.\\d+\\w?[\\w\\d]*"
              },
              "name": {
                "type": "string"
              },
              "description": {
                "type": "string"
              },
              "tiles": {
                "type": "array",
                "items": {
                  "type": "string"
                }
              },
              "vector_layers": {
                "type": "array",
                "items": {
                  "additionalProperties": true,
                  "type": "object"
                }
              },
              "minzoom": {
                "minimum": 0,
                "maximum": 22,
                "type": "integer"
              },
              "maxzoom": {
                "minimum": 0,
                "maximum": 22,
                "type": "integer"
              },
              "bounds": {
                "type": "array",
                "items": {
                  "type": "number"
                }
              },
              "center": {
                "type": "array",
                "items": {
                  "type": "number"
                }
              }
            }
          
          }]
      })
      
    fastify.register(require('@fastify/accepts'))
    fastify.register(require('@fastify/compress'), { global: false, encodings: ['gzip'], customTypes: /x-protobuf$/ });

    fastify.register(require('fastify-openapi-glue'), {
        specification: globalThis.api,
        service: handler,
        securityHandlers: path.join(__dirname, 'security.js'),
        noAdditional: false,
    });


    fastify.register(require("@fastify/view"), {
        engine: {
          eta: require("eta"),
        },
        root: path.join(__dirname, "./views"),
      });


    done()
}