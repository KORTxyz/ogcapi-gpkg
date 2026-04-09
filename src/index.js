import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile, stat, rename, unlink } from 'node:fs/promises';

import fastifyView from '@fastify/view'
import fastifyAccepts from '@fastify/accepts'
import fastifyStatic from '@fastify/static'

import fastifyPlugin from 'fastify-plugin'
import openapiGlue from "fastify-openapi-glue";
import { load, JSON_SCHEMA } from "js-yaml";
import { Eta } from "eta"

import { Service } from "./service.js";
import { initDb, addThumbnail, getThumbnail } from "./database/init.js"
import { postResource } from "./database/styles.js"
import { expandAPI, initDbMap, addDb } from "./helpers/multipleDatasets.js"

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

    //Listen for new datasets
    fastify.events.on('datasetUploaded', async uploadEvent => {
        const { metadata, storage } = uploadEvent;

        if (metadata.uploadType === 'thumbnail') {
            let db;
            if (metadata.dataset && fastify.datasets) {
                const dataset = fastify.datasets.get(metadata.dataset);
                if (!dataset) return;
                db = dataset.db;
                dataset.metadata.thumbnail = 'coverimage';
            } else if (fastify.db) {
                db = fastify.db;
            } else {
                return;
            }
            const imageBuffer = await readFile(storage.path);
            postResource(db, 'coverimage', imageBuffer, metadata.filetype);
            addThumbnail(db, 'coverimage');
            await unlink(storage.path).catch(() => {});
            return;
        }

        const newPath = join(gpkg, metadata.filename);
        await rename(storage.path,newPath);

        addDb(fastify.datasets,newPath,{
            "title":metadata.name,
            "abstract":metadata.description,
            "keywords":JSON.parse(metadata.tags)
        })
    })

    const gpkgIsFolder = (await stat(gpkg)).isDirectory();

    if (gpkgIsFolder) {
        fastify.decorate('datasets', new Map());
        await expandAPI(fastify.api)
        await initDbMap(fastify.datasets, gpkg)
    }

    else{
        const {db} = await initDb(gpkg)
        fastify.decorate("db",db)
    }

    fastify.addHook('preHandler', async (req, reply) => {
        req.contentType = req.query.f || req.accepts().type(['json', 'html']) || "json";
        if (req.server.datasets instanceof Map) {
            if (req.params && req.params.dataset !== undefined) {
                const {db} = req.server.datasets.get(req.params.dataset);
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

    if (gpkgIsFolder) {
        fastify.get('/:dataset/assets/*', (req, reply) => {
            return reply.sendFile(req.params['*']);
        });
    }

    const imageParser = async (payload) => {
        const chunks = [];
        for await (const chunk of payload) chunks.push(chunk);
        return Buffer.concat(chunks);
    };

    fastify.addContentTypeParser('text/html', async (req, payload) => await htmlParser(payload))
    fastify.addContentTypeParser('image/*', async (req, payload) => await imageParser(payload))
    fastify.addContentTypeParser('application/geo+json', { parseAs: 'string' }, fastify.getDefaultJsonParser('ignore', 'ignore'))
    fastify.addContentTypeParser('application/tilejson', { parseAs: 'string' }, fastify.getDefaultJsonParser('ignore', 'ignore'))
    fastify.addContentTypeParser('application/vnd.mapbox.style+json', { parseAs: 'string' }, fastify.getDefaultJsonParser('ignore', 'ignore'))

    fastify.register(openapiGlue, {
        specification: removeTags(fastify.api, "example"),
        serviceHandlers: Service,
    });

    fastify.addHook('onClose', () => {
        if (fastify.datasets instanceof Map) {
            for (const { db } of fastify.datasets.values()) db.close();
        } else if (fastify.db) {
            fastify.db.close();
        }
    });
}


export default fastifyPlugin(ogcapi, {
    fastify: '5.x',
    name: '@kortxyz/ogcapi',
    encapsulate: true
});