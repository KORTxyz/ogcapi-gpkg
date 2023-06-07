const fastify = require('fastify')({
    logger: true
})

fastify.register(require('../src/index'),{
    baseUrl: 'http://127.0.0.1:3000',
    gpkg:'F:/DATA/World/S2Maps_2018.gpkg',
    skipIndex:false, 
})

fastify.register(require('@fastify/cors'), { exposedHeaders: 'Content-Disposition' });

fastify.listen({port: 3000}, function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
    // Server is now listening on ${address}
})