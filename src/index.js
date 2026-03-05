import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';

import fastifyView from '@fastify/view'
import fastifyAccepts from '@fastify/accepts'
import fastifyStatic from '@fastify/static'

import fastifyPlugin from 'fastify-plugin'
import openapiGlue from "fastify-openapi-glue";
import { load, JSON_SCHEMA } from "js-yaml";
import { Eta } from "eta"

import { Service } from "./service.js";
import { initDb } from "./database/init.js"

const moduleDir = dirname(fileURLToPath(import.meta.url));

const removeTags = (APIspec, tag) => JSON.parse(JSON.stringify(APIspec, (k, v) => k === tag ? undefined : v));

const ogcapi = async (fastify, options) => {
    const { gpkg, readonly = true, skipLandingpage, baseurl = "http://127.0.0.1:3000", prefix = '', } = options;

    const sourceData = await readFile("./src/openapi.yaml", "utf-8");
    let api = load(sourceData, { schema: JSON_SCHEMA })

    fastify.decorate('api', api)
    fastify.decorate('readonly', readonly)

    fastify.api.servers[0].url = baseurl + prefix;

    if (skipLandingpage) delete fastify.api.paths["/"]

    if (readonly) {
        fastify.api = removeTags(fastify.api, "post")
        fastify.api = removeTags(fastify.api, "put")
        fastify.api = removeTags(fastify.api, "patch")
        fastify.api = removeTags(fastify.api, "delete")
    }

    fastify.decorate('db', await initDb(gpkg))

    fastify.addHook('preHandler', async (req, reply) => {
        req.contentType = req.query.f || req.accepts().type(['json', 'html']) || "json";
    })

    fastify.register(fastifyAccepts);

    fastify.register(fastifyView, {
        engine: { eta: new Eta() },
        templates: resolve(moduleDir, 'views'),
    });

    fastify.register(fastifyStatic, {
        root: resolve(moduleDir, 'assets'),
        prefix: '/assets/',
    })

    fastify.addContentTypeParser('text/html', async (req, payload) => await htmlParser(payload))
    fastify.addContentTypeParser('image/*', async (req, payload) => await imageParser(payload))
    fastify.addContentTypeParser('application/geo+json', { parseAs: 'string' }, fastify.getDefaultJsonParser('ignore', 'ignore'))
    fastify.addContentTypeParser('application/tilejson', { parseAs: 'string' }, fastify.getDefaultJsonParser('ignore', 'ignore'))
    fastify.addContentTypeParser('application/vnd.mapbox.style+json', { parseAs: 'string' }, fastify.getDefaultJsonParser('ignore', 'ignore'))

    fastify.register(openapiGlue, {
        specification: removeTags(fastify.api, "example"),
        serviceHandlers: new Service(fastify, baseurl + prefix),
    });

}


export default fastifyPlugin(ogcapi, {
    fastify: '5.x',
    name: '@kortxyz/ogcapi',
    encapsulate: true
});