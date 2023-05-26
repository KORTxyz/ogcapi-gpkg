const fastify = require('fastify')({
    logger: true
})

fastify.register(require('../src/index'),{
    baseUrl: 'http://127.0.0.1:3000',
    gpkg:'data/naturcenter.gpkg',
    skipIndex:false, 
})

fastify.listen({port: 3000}, function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
    // Server is now listening on ${address}
})