import fastifyPlugin from 'fastify-plugin';
import { Server } from '@tus/server';
import { FileStore } from '@tus/file-store';
import { EVENTS } from '@tus/utils'

const tusPlugin = async (fastify, options) => {
    const {
        path = '/files',
        directory = './files',
        ...tusOptions
    } = options;

    const tusServer = new Server({
        path,
        datastore: new FileStore({ directory }),
        ...tusOptions,
    });


    // Encapsulated sub-context so parser changes don't leak to the parent app
    fastify.register(async (scope) => {
        scope.removeAllContentTypeParsers();
        scope.addContentTypeParser('*', (request, payload, done) => done(null));

        scope.all(path, (req, reply) => {
            tusServer.handle(req.raw, reply.raw);
            reply.hijack();
        });

        scope.all(`${path}/*`, (req, reply) => {
            tusServer.handle(req.raw, reply.raw);
            reply.hijack();
        });
    });
    tusServer.on(EVENTS.POST_CREATE, async (req, res, upload) => {
        fastify.log.info({ upload }, 'Upload created')
    })

    tusServer.on(EVENTS.POST_FINISH, async (req, res, upload) => {
        fastify.log.info({ upload }, 'Upload finished')
        fastify.events.emit('datasetUploaded', upload)
    })

    fastify.addHook('onClose', () => tusServer.cleanUpExpiredUploads());

    fastify.decorate('tusServer', tusServer);
};

export default fastifyPlugin(tusPlugin, {
    fastify: '5.x',
    name: 'fastify-tus',
});