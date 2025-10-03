#!/usr/bin/env node
import Fastify from "fastify";
import minimist from "minimist";

import cors from '@fastify/cors'
import selfsigned from 'selfsigned';

import ogcapi from './src/index.js';

const argv = minimist(process.argv.slice(2));

const port = argv.port || 3000;
const baseurl = argv.baseurl || 'https://127.0.0.1:'+port;
const gpkg = argv._[0];


const attrs = [{ name: 'commonName', value: 'localhost' }];
const pems = selfsigned.generate(attrs, { days: 365 });

const fastify = Fastify({
    logger: false,
    http2: true,
    https: { key: pems.private, cert: pems.cert }
});

fastify.register(cors, {
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'OPTIONS']
})

fastify.register(ogcapi, {
    baseurl,
    gpkg,
    skipLandingpage: false,
    readonly: true
});



fastify.listen({ port, host: '0.0.0.0' }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`🚀 Server listening at ${address}`);
});