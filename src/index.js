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
    if(opts.skipIndex) delete globalThis.api.paths["/"]    
    const handler = getHandlers();

    fastify.addContentTypeParser('application/geo+json', { parseAs: 'string' }, fastify.getDefaultJsonParser('ignore', 'ignore'))

    fastify.register(require('@fastify/static'), {
        root: path.join(__dirname, 'public'),
        prefix: '/public/',
      })

    fastify.register(require('@fastify/accepts'))

    fastify.register(require('fastify-openapi-glue'), {
        specification: globalThis.api,
        service: handler,
        securityHandlers: path.join(__dirname, 'security.js'),
        noAdditional: false,
    });

    fastify.register(require('@fastify/cors'), { exposedHeaders: 'Content-Disposition' });

    fastify.register(require("@fastify/view"), {
        engine: {
          eta: require("eta"),
        },
        root: path.join(__dirname, "./views"),
      });


    done()
}