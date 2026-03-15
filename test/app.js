import Fastify from 'fastify'

import ogcapi from '../src/index.js';

import fastifyView from '@fastify/view'
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Eta } from "eta"

  const faviconPng = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wwAAoMBgAGL1ioAAAAASUVORK5CYII=',
    'base64'
  );

const build = (opts = {}) => {
    const app = Fastify({
        ...opts
    })
    const __dirname = dirname(fileURLToPath(import.meta.url));

    app.register(fastifyView, {
        engine: { eta: new Eta() },
        templates: `${__dirname}/views2`,
    });

    app.get('/favicon.ico', async (_req, reply) => {
        reply.header('Cache-Control', 'public, max-age=86400');
        return reply.type('image/png').send(faviconPng);
    });

    app.register(ogcapi, {
        baseurl: process.env.BASEURL,
        gpkg: process.env.GPKG
    });

    return app
}

export default build;
