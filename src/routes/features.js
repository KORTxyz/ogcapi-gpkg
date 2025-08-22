import * as model from "../database/features.js";
import * as templates from "../templates/features.js";


async function getItems(req, reply) {
    const { baseurl, db } = this;

    const { contentType } = req;
    const { collectionId } = req.params;
    const { f, limit, offset, bbox, properties, ...searchParams } = req.query;
    /* TODO: bbox-crs as a URL-parameter*/

    if (contentType == "json") {
        let geojsonFeatures = await model.getItems(db, collectionId, limit, offset, bbox, properties, searchParams);
        const templatedFeatures = templates.items(baseurl, collectionId, geojsonFeatures, limit, offset, searchParams);

        reply.send(templatedFeatures);
    }
    else if (contentType == "html") return reply.view("items", { baseurl, collectionId });
};


async function postItems(req, reply) {
    const { baseurl, db } = this;
    const { collectionId } = req.params;

    const { lastInsertRowid } = await model.postItems(db, collectionId, req.body)

    reply.status(201).send({ Location: baseurl + '/collections/' + collectionId + '/items/' + lastInsertRowid })
};


async function getItem(req, reply) {
    const { baseurl, db } = this;

    const { contentType } = req;

    const { collectionId, featureId } = req.params;
    if (contentType == "html") return reply.view("item", { baseurl, collectionId, featureId });

    const feature = await model.getItem(db, collectionId, featureId)
    if (!feature) reply.status(404);

    reply.type('application/json').send(feature);
};


async function putItem(req, reply) {
    const { baseurl, db } = this;
    const { collectionId, featureId } = req.params;

    const { lastInsertRowid } = await model.putItem(db, collectionId, featureId, req.body)

    reply.status(201).send({ Location: baseurl + '/collections/' + collectionId + '/items/' + lastInsertRowid })
};


async function patchItem(req, reply) {
    const { db } = this;
    const { collectionId, featureId } = req.params;

    const { changes } = await model.patchItem(db, collectionId, featureId, req.body)

    if (changes === 0) return reply.status(404).send({ error: 'Feature not found.' });
    reply.status(204).send();
};


async function deleteItem(req, reply) {
    const { db } = this;
    const { collectionId, featureId } = req.params;

    const { changes } = await model.deleteItem(db, collectionId, featureId)

    if (changes === 0) return reply.status(404).send({ error: 'Feature not found.' });
    reply.status(204).send();
};


async function getSchema(req, reply) {
    const { collectionId } = req.params;
    const { f } = req.query;

    const { properties, geometryType } = await model.getSchema(this.db, collectionId)
    console.log(properties,geometryType)
    reply.type('application/json').send(templates.schema(this.baseurl, collectionId, properties, geometryType));

};



export {
    getItems,
    postItems,
    getItem,
    putItem,
    patchItem,
    deleteItem,
    getSchema
}