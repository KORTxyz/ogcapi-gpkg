import Fastify from 'fastify'

import ogcapi from '../src/index.js';

import fastifyView from '@fastify/view'
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Eta } from "eta"


const build = (opts = {}) => {
    const app = Fastify({
        ...opts
    })
    const __dirname = dirname(fileURLToPath(import.meta.url));
    
    app.register(fastifyView, {
        engine: { eta: new Eta() },
        templates: `${__dirname}/views2`,
    });

    app.register(ogcapi, {
        baseurl: process.env.BASEURL,
        gpkg: process.env.GPKG, 
        skipLandingpage: false
    });

    return app
}

export default build;
