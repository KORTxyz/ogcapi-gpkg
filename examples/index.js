const fastify = require('fastify')({
    logger: true
})

fastify.register(require('../src/index'),{
    baseUrl: 'http://127.0.0.1:3000',
    //gpkg:'../../../DATA/OGCAPI/2023/Daraa2-MultiLayer-WebMercator-embedded.gpkg',
    gpkg:'../../../DATA/OGCAPI/OS_Open_Zoomstack.gpkg',
    skipLandingpage:false, 
})

fastify.register(require('@fastify/cors'), { exposedHeaders: 'Content-Disposition' });

fastify.listen({port: 3000}, function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
    // Server is now listening on ${address}
})