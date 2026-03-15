import * as model from '../database/common.js';
import * as templates from '../templates/common.js';

async function getLandingpage(req, reply) {
  const baseurl = [req.server.baseurl, req.params.dataset].join("/");
  const { contentType } = req;

  if (contentType == "json") {
    reply.send(templates.landingPage(baseurl))
  }
  else if (contentType == "html") return reply.view("landingpage", {baseurl});
};


async function getConformance(req, reply) {
  const { contentType } = req;

  if (contentType == "json") {
    reply.send(templates.conformance());
  }
  else if (contentType == "html") return reply.view("conformance", { conformsTo: templates.conformance() });
};


async function getAPI(req, reply) {
  const baseurl = [req.server.baseurl, req.params.dataset].join("/");

  const { contentType } = req;

  if (contentType == "json") {
    reply.type('application/json').send(req.server.api)
  }
  else if (contentType == "html") return reply.view("redoc", {baseurl});
};


async function getCollections(req, reply) {
  const db = req.db || req.server.db;
  const baseurl = [req.server.baseurl, req.params.dataset].join("/");

  const { contentType } = req;
  const { q, keywords, limit, offset, bbox } = req.query;

  if (contentType == "json") {
    const collections = model.getCollections(db, q, keywords, limit, offset, bbox)
    const templatedCollections = collections.map(collection => templates.collection(baseurl, collection));
    
    reply.send(templates.collections(baseurl, templatedCollections))
  }
  else if (contentType == "html") return reply.view("collections",{baseurl});
};


async function getCollection(req, reply) {
  const db = req.db || req.server.db;
  const baseurl = [req.server.baseurl, req.params.dataset].join("/");

  const { contentType } = req;
  const { collectionId } = req.params;

  const collection = model.getCollection(db, collectionId);
  if (collection == undefined) return reply.callNotFound();
  if (contentType == "json") {
    reply.send(templates.collection(baseurl, collection))
  }
  else if (contentType == "html") return reply.view("collection",{collection,baseurl});
};


async function getDatasets(req, reply) {
  const { contentType } = req;
  const datasetNames = [...req.server.db.keys()];
  const baseurl = req.server.baseurl;

  const placeholders = [
    {
      title: "Dataset Landing Page",
      description: "Overview and entry points for this dataset.",
      thumbnail:
        "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='%23232a35'/><stop offset='100%' stop-color='%23384559'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23g)'/><circle cx='680' cy='90' r='70' fill='%23ffffff22'/><rect x='40' y='68' width='360' height='28' rx='6' fill='%23ffffff44'/><rect x='40' y='112' width='520' height='16' rx='4' fill='%23ffffff33'/><rect x='40' y='144' width='470' height='16' rx='4' fill='%23ffffff22'/><rect x='40' y='210' width='220' height='140' rx='10' fill='%23ffffff22'/><rect x='280' y='210' width='220' height='140' rx='10' fill='%23ffffff1a'/><rect x='520' y='210' width='220' height='140' rx='10' fill='%23ffffff10'/></svg>",
    },
    {
      title: "Geospatial Webapp Development",
      description: "UI experiments and map-centric interaction ideas.",
      thumbnail:
        "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450'><rect width='100%' height='100%' fill='%23e5e7eb'/><rect x='40' y='40' width='320' height='24' rx='6' fill='%23cfd6de'/><rect x='40' y='80' width='500' height='16' rx='4' fill='%23d5dbe3'/><rect x='40' y='118' width='260' height='16' rx='4' fill='%23dfe4ea'/></svg>",
    },
    {
      title: "Untitled",
      description: "Draft dataset configuration and metadata placeholder.",
      thumbnail:
        "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450'><rect width='100%' height='100%' fill='%23f3f4f6'/><rect x='250' y='110' width='300' height='220' rx='10' fill='%23ffffff' stroke='%23d1d5db' stroke-width='6'/></svg>",
    },
  ];

  const datasets = datasetNames.map((id, idx) => {
    const placeholder = placeholders[idx % placeholders.length];
    return {
      id,
      title: placeholder.title,
      description: placeholder.description,
      thumbnail: placeholder.thumbnail,
      links: [
        { href: `${baseurl}/${id}`, rel: "self", type: "application/json", title: id }
      ]
    };
  });

  if (contentType == "html") return reply.view("dataset", { datasets, baseurl });
  reply.send({ datasets });
};

export {
  getLandingpage,
  getConformance,
  getAPI,
  getCollections,
  getCollection,
  getDatasets
}