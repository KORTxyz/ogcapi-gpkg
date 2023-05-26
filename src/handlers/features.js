const templates = require('../templates/features');
const model = require('../model/features');

const getItems = async (req, reply, fastify) => {
    const { collectionId } = req.params;
    const { f, limit, offset, bbox, properties, ...searchParams } = req.query;

    if (f == "json") {
        const features = await model.getItems(collectionId, limit, offset, bbox, properties, searchParams)
        reply.type('application/json').send(templates.items(collectionId, features, limit, offset, searchParams));
    }
    else {
        return reply.view("items", { collectionId });
    }
};

const postItems = async (req, reply, fastify) => {
    const { collectionId } = req.params;
    
    await model.postItems(collectionId, req.body)

    reply.status(200).send({ ok: true })
};

const getItem = async (req, reply, fastify) => {
    const { collectionId, featureId } = req.params;
    const { f, zoomlevel } = req.query;

    if (f == "json") {
        const feature = await model.getItem(collectionId, featureId, zoomlevel)
        //const template = templates.item(collectionId, featureId, feature);
        if(!feature) reply.status(404);

        reply.type('application/json').send(feature);
    }
    else {
        return reply.view("items", { collectionId });
    }
};

const getSchema = async (req, reply, fastify) => {
    const { collectionId } = req.params;
    const { f } = req.query;

    const { properties, geometryType } = await model.getSchema(collectionId)

    reply.type('application/json').send(templates.schema(collectionId, properties, geometryType));

};

module.exports = {
    getItems,
    postItems,
    getItem,
    getSchema
}
