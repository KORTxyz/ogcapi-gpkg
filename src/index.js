import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';

import fastifyAccepts from '@fastify/accepts'
import fastifyView from '@fastify/view'
import fastifyStatic from '@fastify/static'

import fastifyPlugin from 'fastify-plugin'
import openapiGlue from "fastify-openapi-glue";
import yaml from "js-yaml";
import { Eta } from "eta"

import { Service } from "./service.js";
import {initDb} from "./model/init.js"

const __dirname = dirname(fileURLToPath(import.meta.url));

async function readYaml() {
    const openapiFile = await readFile(`${__dirname}/openapi.yaml`, "binary");
    return yaml.load(openapiFile);
}

const ogcapi = async (fastify, options) => {
    const { gpkg, skipLandingpage, ...opts } = options;

    fastify.decorate('api', await readYaml())
    if(skipLandingpage) delete fastify.api.paths["/"]    
    
    fastify.decorate('db', await initDb(gpkg))

    fastify.addHook('preHandler', async (req, reply) => {
        req.contentType = req.query.f || req.accepts().type(['json', 'html']) || "json";
    })

    fastify.register(fastifyAccepts);

    fastify.register(fastifyView, {
        engine: { eta: new Eta() },
        templates: `${__dirname}/views`,
    });

    fastify.register(fastifyStatic, {
        root: [
          `${__dirname}/assets`
        ],
        prefix: '/assets/'
      })

    fastify.addContentTypeParser('text/html', async (req, payload) => await htmlParser(payload))
    fastify.addContentTypeParser('image/*', async (req, payload) => await imageParser(payload))
    fastify.addContentTypeParser('application/geo+json', { parseAs: 'string' }, fastify.getDefaultJsonParser('ignore', 'ignore'))
    fastify.addContentTypeParser('application/tilejson', { parseAs: 'string' }, fastify.getDefaultJsonParser('ignore', 'ignore'))
    fastify.addContentTypeParser('application/vnd.mapbox.style+json', { parseAs: 'string' }, fastify.getDefaultJsonParser('ignore', 'ignore'))

    fastify.register(openapiGlue, {
        specification: fastify.api,
        serviceHandlers: new Service(fastify, opts),
    });

}


export default fastifyPlugin(ogcapi);