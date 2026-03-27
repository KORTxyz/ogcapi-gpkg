import fs from 'node:fs/promises'
import os from 'node:os'
import { dirname,join } from 'node:path';
import { fileURLToPath } from 'node:url';

import Fastify from 'fastify';
import fastifyView from '@fastify/view'
import { Eta } from "eta"

import ogcapi from '../src/index.js';
import tusPlugin from "../src/plugins/upload.js";
import eventsPlugin from "../src/plugins/events.js";


const faviconPng = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wwAAoMBgAGL1ioAAAAASUVORK5CYII=',
    'base64'
);

const __dirname = dirname(fileURLToPath(import.meta.url));

const tempDir = os.tmpdir()
const uploadDir = await fs.mkdtemp(join(tempDir, '.tmp'))

const build = async (opts = {}) => {
    const app = Fastify({
        ...opts
    })

    app.register(fastifyView, {
        engine: { eta: new Eta() },
        templates: `${__dirname}/views2`,
    });

    app.get('/favicon.ico', async (_req, reply) => {
        reply.header('Cache-Control', 'public, max-age=86400');
        return reply.type('image/png').send(faviconPng);
    });

    app.register(eventsPlugin)

    app.register(tusPlugin, { path:'/upload', directory: '.temp' })

    app.register(ogcapi, {
        baseurl: process.env.BASEURL,
        gpkg: process.env.GPKG
    });

    return app
}

export default build;
