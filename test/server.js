'use strict'
import build from './app.js';
import cors from '@fastify/cors'

/*
import selfsigned from 'selfsigned';

const attrs = [{ name: 'commonName', value: 'localhost.com' }];
const pems = selfsigned.generate(attrs, { days: 365 });
*/
const server = build({
  logger: true,
 // http2: true,
  // https: { key: pems.private, cert: pems.cert }
})

await server.register(cors)

server.listen({ port: 3000, host: '127.0.0.1' }, (err, address) => {
  //console.log(server.printRoutes())
  if (err) {
    server.log.error(err)
    process.exit(1)
  }
})