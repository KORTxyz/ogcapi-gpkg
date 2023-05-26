const templates = require('../templates/common');
const model = require('../model/common');

const { baseurl } = process.env;


module.exports = {
  getLandingpage: async (req, reply, fastify) => {
    const { f } = req.query;

    if(f=="json") reply.send(templates.landingPage())
    else{
      return reply.view("landingpage",{});
    }

  },

  getConformance: async (req, reply, fastify) => {
    const { f } = req.query;

    if(f=="json") return reply.view("conformance",{conformsTo:templates.conformance()}); 
    else{
      reply.send(templates.conformance())
    }

  },

  getAPI: async (req, reply, fastify) => {
    const { f } = req.query;
    if(f=="json") reply.send(globalThis.api)
    else{
      return reply.view("redoc",{baseurl});

    }
  },

  getCollections: async (req, reply, fastify) => {
    console.log(req.accepts().type(['json', 'html'])) //request for json or html
    
    const { f, q, keywords, limit, offset, bbox } = req.query;

    const collections = model.getCollections(q, keywords, limit, offset, bbox).map(collection => templates.collection(collection))

    if(f=="json") {
      reply.send(templates.collections(collections))
    }
    else{
      return reply.view("collections");

    }
  },

  getCollection: async (req, reply, fastify) => {
    const { f } = req.query;
    const { collectionId } = req.params;

    let collection =  model.getCollection(collectionId) 
    if(!collection) reply.code(404).type('text/html').send('Not Found')
    
    collection = templates.collection(collection)
    
    if(f=="json") {
      reply.send(collection)
    }
    else{
      return reply.view("collection",collection);
    }

  },
}
