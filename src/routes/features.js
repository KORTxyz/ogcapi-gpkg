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


async function postItems(req, reply){
    const { baseurl, db } = this;

    const { collectionId } = req.params;
    
    await model.postItems(collectionId, req.body)

    reply.status(200).send({ ok: true })
};

async function getItem(req, reply) {
    const { baseurl, db } = this;

    const { contentType } = req;

    const { collectionId, featureId } = req.params;
    console.log(featureId)
    if(contentType == "html") return reply.view("item", { baseurl, collectionId, featureId });

    const feature = await model.getItem(db, collectionId, featureId)
    if(!feature) reply.status(404);

    reply.type('application/json').send(feature);
};

//putItem

//patchItem

//deleteItem

async function getSchema(req, reply){
    const { collectionId } = req.params;
    const { f } = req.query;

    const { properties, geometryType } = await model.getSchema(this.db, collectionId)

    reply.type('application/json').send(templates.schema(this.baseurl,collectionId, properties, geometryType));

};



export {
    getItems,
    getItem,
    getSchema
}