import * as model from '../database/common.js';
import { updateMetadata } from '../database/init.js';
import * as templates from '../templates/common.js';

async function getLandingpage(req, reply) {
  const baseurl = req.params.dataset ? [req.server.baseurl, req.params.dataset].join("/") : req.server.baseurl;
  const { contentType } = req;

  if (contentType == "json") {
    reply.send(templates.landingPage(baseurl))
  }
  else if (contentType == "html") {
    const metadata = req.params.dataset ? req.server.datasets?.get(req.params.dataset)?.metadata : undefined;
    return reply.view("landingpage", {
      baseurl,
      dataset: req.params.dataset,
      datasetsUrl: req.server.baseurl,
      title: metadata?.title || req.params.dataset,
      description: metadata?.abstract,
      keywords: metadata?.keywords,
      thumbnail: metadata?.thumbnail ? baseurl + '/resources/' + metadata.thumbnail : null,
    });
  }
};


async function getConformance(req, reply) {
  const { contentType } = req;

  if (contentType == "json") {
    reply.send(templates.conformance());
  }
  else if (contentType == "html") return reply.view("conformance", { conformsTo: templates.conformance() });
};


async function getAPI(req, reply) {
  const baseurl = req.params.dataset ? [req.server.baseurl, req.params.dataset].join("/") : req.server.baseurl;

  const { contentType } = req;

  if (contentType == "json") {
    reply.type('application/json').send(req.server.api)
  }
  else if (contentType == "html") return reply.view("redoc", { baseurl });
};


async function getCollections(req, reply) {
  const db = req.db || req.server.db;
  const baseurl = req.params.dataset ? [req.server.baseurl, req.params.dataset].join("/") : req.server.baseurl;

  const { contentType } = req;
  const { q, keywords, limit, offset, bbox } = req.query;

  if (contentType == "json") {
    const collections = model.getCollections(db, q, keywords, limit, offset, bbox)
    const templatedCollections = collections.map(collection => templates.collection(baseurl, collection));

    reply.send(templates.collections(baseurl, templatedCollections))
  }
  else if (contentType == "html") return reply.view("collections", { baseurl, dataset: req.params.dataset, datasetsUrl: req.server.baseurl });
};


async function getCollection(req, reply) {
  const db = req.db || req.server.db;
  const baseurl = req.params.dataset ? [req.server.baseurl, req.params.dataset].join("/") : req.server.baseurl;

  const { contentType } = req;
  const { collectionId } = req.params;

  const collection = model.getCollection(db, collectionId);
  if (collection == undefined) return reply.callNotFound();
  if (contentType == "json") {
    reply.send(templates.collection(baseurl, collection))
  }
  else if (contentType == "html") return reply.view("collection", { collection, baseurl, dataset: req.params.dataset, datasetsUrl: req.server.baseurl });
};


async function getDatasets(req, reply) {
  const { contentType, server: { baseurl, datasets } } = req;

  const datasetList = [...datasets].map((dataset) => {
    const [id, { metadata }] = dataset;

    return {
      id,
      title: metadata?.title || id,
      description: metadata?.abstract,
      thumbnail: metadata?.thumbnail ? `${baseurl}/${id}/resources/${metadata.thumbnail}` : "https://picsum.photos/800/450",
      tags: metadata?.keywords,
      links: [
        { href: `${baseurl}/${id}`, rel: "self", type: "application/json", title: id },
        { href: `${baseurl}/${id}`, rel: "alternative", type: "text/html", title: id }
      ]
    };
  });

  if (contentType == "html") return reply.view("dataset", { baseurl, datasetList });
  reply.send({ datasetList });
};

async function putLandingpage(req, reply) {
  const { title, abstract: description, keywords } = req.body;

  if (req.params.dataset) {
    const entry = req.server.datasets?.get(req.params.dataset);
    if (!entry) return reply.callNotFound();
    updateMetadata(entry.db, { title, abstract: description, keywords });
    entry.metadata.title = title;
    entry.metadata.abstract = description;
    entry.metadata.keywords = keywords;
  } else {
    const db = req.server.db;
    if (!db) return reply.status(400).send({ error: 'No database available' });
    updateMetadata(db, { title, abstract: description, keywords });
  }

  reply.status(200).send({ title, abstract: description, keywords });
};

export {
  getLandingpage,
  putLandingpage,
  getConformance,
  getAPI,
  getCollections,
  getCollection,
  getDatasets
}