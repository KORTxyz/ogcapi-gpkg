import * as model from '../model/common.js';
import * as templates from '../templates/common.js';

async function getLandingpage(req, reply) {
  const { baseurl } = this;
  const { contentType } = req;

  if (contentType == "json") {
    reply.send(templates.landingPage(baseurl))
  }
  else if (contentType == "html") return reply.view("landingpage", {});
};


async function getConformance(req, reply) {
  const { contentType } = req;

  if (contentType == "json") {
    reply.send(templates.conformance());
  }
  else if (contentType == "html") return reply.view("conformance", { conformsTo: templates.conformance() });
};


async function getAPI(req, reply) {
  const { contentType } = req;

  if (contentType == "json") {
    reply.send(this.api)
  }
  else if (contentType == "html") return reply.view("redoc", { baseurl: this.baseurl });
};


async function getCollections(req, reply) {
  const { contentType } = req;
  const { q, keywords, limit, offset, bbox } = req.query;

  if (contentType == "json") {
    const collections = model.getCollections(this.db, q, keywords, limit, offset, bbox)
    const templatedCollections = collections.map(collection => templates.collection(this.baseurl, collection));
    
    reply.send(templates.collections(this.baseurl, templatedCollections))
  }
  else if (contentType == "html") return reply.view("collections");
};


async function getCollection(req, reply) {
  const { contentType } = req;
  const { collectionId } = req.params;

  const collection = model.getCollection(this.db, collectionId);
  if (collection == undefined) return reply.callNotFound();
  if (contentType == "json") {
    reply.send(templates.collection(this.baseurl, collection))
  }
  else if (contentType == "html") return reply.view("collection",{collection});
};


export {
  getLandingpage,
  getConformance,
  getAPI,
  getCollections,
  getCollection
}