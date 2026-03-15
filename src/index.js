import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile, stat } from 'node:fs/promises';

import fastifyView from '@fastify/view'
import fastifyAccepts from '@fastify/accepts'
import fastifyStatic from '@fastify/static'

import fastifyPlugin from 'fastify-plugin'
import openapiGlue from "fastify-openapi-glue";
import { load, JSON_SCHEMA } from "js-yaml";
import { Eta } from "eta"

import { Service } from "./service.js";
import { initDb, initDbMap } from "./database/init.js"

const moduleDir = dirname(fileURLToPath(import.meta.url));

const removeTags = (APIspec, tag) => JSON.parse(JSON.stringify(APIspec, (k, v) => k === tag ? undefined : v));

const ogcapi = async (fastify, options) => {
    const { gpkg, readonly, skipLandingpage, baseurl = "http://127.0.0.1:3000", prefix = '', } = options;
    const sourceData = await readFile(`${moduleDir}/openapi.yaml`, "utf-8");
    let api = load(sourceData, { schema: JSON_SCHEMA })

    fastify.decorate('api', api)
    fastify.decorate('readonly', readonly)
    fastify.decorate('baseurl', baseurl + prefix)
    


    fastify.api.servers[0].url = baseurl + prefix;

    if (skipLandingpage) delete fastify.api.paths["/"]

    if (readonly) {
        fastify.api = removeTags(fastify.api, "post")
        fastify.api = removeTags(fastify.api, "put")
        fastify.api = removeTags(fastify.api, "patch")
        fastify.api = removeTags(fastify.api, "delete")
    }

    const isFolder = (await stat(gpkg)).isDirectory();
    const dbResult = isFolder ? await initDbMap(gpkg) : await initDb(gpkg);
    fastify.decorate('db', dbResult);

    if (isFolder) {
        // Add dataset path parameter to components
        fastify.api.components = fastify.api.components || {};
        fastify.api.components.parameters = fastify.api.components.parameters || {};
        fastify.api.components.parameters.dataset = {
            name: 'dataset',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Dataset identifier (GeoPackage filename without extension)'
        };

        const datasetRef = { $ref: '#/components/parameters/dataset' };
        const existingPaths = Object.entries(fastify.api.paths);
        const newPaths = {};

        // Add root datasets listing
        newPaths['/'] = {
            get: {
                summary: 'List available datasets',
                operationId: 'getDatasets',
                tags: ['Capabilities'],
                parameters: [],
                responses: { 200: { description: 'List of datasets' } }
            }
        };

        for (const [path, pathItem] of existingPaths) {
            const newPath = '/{dataset}' + (path === '/' ? '' : path);
            const newPathItem = JSON.parse(JSON.stringify(pathItem));
            for (const method of ['get','post','put','patch','delete','head','options']) {
                if (newPathItem[method]) {
                    newPathItem[method].parameters = [datasetRef, ...(newPathItem[method].parameters || [])];
                }
            }
            newPaths[newPath] = newPathItem;
        }

        fastify.api.paths = newPaths;
    }

    fastify.addHook('preHandler', async (req, reply) => {
        req.contentType = req.query.f || req.accepts().type(['json', 'html']) || "json";
        if (req.server.db instanceof Map) {
            if (req.params && req.params.dataset !== undefined) {
                const db = req.server.db.get(req.params.dataset);
                if (!db) return reply.status(404).send({ error: 'Dataset not found.' });
                req.db = db;
            }
        }
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

    if (isFolder) {
        fastify.get('/:dataset/assets/*', (req, reply) => {
            return reply.sendFile(req.params['*']);
        });
    }

    fastify.addContentTypeParser('text/html', async (req, payload) => await htmlParser(payload))
    fastify.addContentTypeParser('image/*', async (req, payload) => await imageParser(payload))
    fastify.addContentTypeParser('application/geo+json', { parseAs: 'string' }, fastify.getDefaultJsonParser('ignore', 'ignore'))
    fastify.addContentTypeParser('application/tilejson', { parseAs: 'string' }, fastify.getDefaultJsonParser('ignore', 'ignore'))
    fastify.addContentTypeParser('application/vnd.mapbox.style+json', { parseAs: 'string' }, fastify.getDefaultJsonParser('ignore', 'ignore'))

    fastify.register(openapiGlue, {
        specification: removeTags(fastify.api, "example"),
        serviceHandlers: Service,
    });

}


export default fastifyPlugin(ogcapi, {
    fastify: '5.x',
    name: '@kortxyz/ogcapi',
    encapsulate: true
});