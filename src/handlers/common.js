const templates = require('../templates/common');
const model = require('../model/common');

const { baseurl } = process.env;

const getContentType = (req) => req.query.f || req.accepts().type(['json', 'html']) || "json";


module.exports = {
  getLandingpage: async (req, reply, fastify) => {
    const contentType = getContentType(req);

    if(contentType=="json") reply.send(templates.landingPage())
    else if(contentType=="html") reply.view("landingpage",{});
    else return reply.code(400).send();
  },

  getConformance: async (req, reply, fastify) => {
    const contentType = getContentType(req);

    if(contentType=="json") reply.view("conformance",{conformsTo:templates.conformance()}); 
    else if(contentType=="html") reply.send(templates.conformance());
    else return reply.code(400).send();
  },

  getAPI: async (req, reply, fastify) => {
    const contentType = getContentType(req);

    if(contentType=="json") reply.send(globalThis.api)
    else if(contentType=="html")  reply.view("redoc",{baseurl});
    else return reply.code(400).send();
  },

  getCollections: async (req, reply, fastify) => {
    const contentType = getContentType(req);
    const { q, keywords, limit, offset, bbox } = req.query;

    const collections = model.getCollections(q, keywords, limit, offset, bbox).map(collection => templates.collection(collection));

    if(contentType=="json") reply.send(templates.collections(collections));
    else if(contentType=="html") reply.view("collections");
    else return reply.code(400).send();
  },

  getCollection: async (req, reply, fastify) => {
    const contentType = getContentType(req);
    const { collectionId } = req.params;

    const collection =  model.getCollection(collectionId);
    if(!collection) reply.code(404).type('text/html').send('Not Found');
    
    const templatedCollection = templates.collection(collection);
    
    if(contentType=="json") reply.send(templatedCollection);
    else if(contentType=="html") reply.view("collection",templatedCollection);
    else return reply.code(400).send();

  },
}
