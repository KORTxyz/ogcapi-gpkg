import Fastify from 'fastify'

import ogcapi from '../src/index.js';

const build = (opts = {}) => {
    const app = Fastify({
        ...opts,
        ajv: {
            customOptions: {
                keywords: ["example"]
            },
        }
    })
    app.register(ogcapi, {
        baseurl: process.env.BASEURL,
        gpkg: process.env.GPKG, 
        skipLandingpage: false
    });

    return app
}

export default build;
