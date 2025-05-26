import * as model from "../database/tiles.js"
import * as helpers from "../helpers/tiles.js"
import * as templates from "../templates/tiles.js"

import * as modelCommon from "../database/common.js"


import isGzip from 'is-gzip';
import { filetypemime } from 'magic-bytes.js';


async function getCollectionTilesets(req, reply) {
  const { baseurl, db } = this;

  const { contentType } = req;
  const { collectionId } = req.params;

  const collection = modelCommon.getCollection(db, collectionId);

  if (collection.data_type == "tiles") return reply.callNotFound();
  if (contentType == "html") return reply.view("tilesets", {baseurl, collectionId });

  reply.send(templates.collectionTileSets(baseurl, collection));
};

async function getCollectionTileset(req, reply) {
  const { baseurl, db } = this;

  const { contentType } = req;
  const { collectionId } = req.params;

  const collection = modelCommon.getCollection(db, collectionId)

  if (contentType == "html") return reply.view("tileset", { baseurl, collectionId });

  const layers = collection.data_type == 'vector-tiles' ? await model.getVectorTilesSpec(db, collection.name) : [{"id": collection.name,"dataType":'vector'}];
  
  if (contentType == "json") reply.send(templates.collectionTileSet(baseurl, collection, layers));

};

async function getCollectionTile(req, reply) {
  const { collectionId, tileMatrix, tileRow, tileCol } = req.params;
  const { limit = 10000, properties = null } = req.query;
  
  const {data_type} = modelCommon.getCollection(this.db, collectionId)

  let tile;
  if (data_type == 'features') tile = await helpers.getAsVectorTile(this.db, collectionId, tileMatrix, tileRow, tileCol, limit, properties)

  else tile = await model.getCollectionTile(this.db,collectionId, tileMatrix, tileRow, tileCol)
  if (tile) {
    if (typeof tile == "object") tile = Buffer.from(tile)
    const gzip = await isGzip(tile)

    reply
      .header('Content-Type', 'application/vnd.mapbox-vector-tile')
      .header('Content-Encoding', gzip ? 'gzip' : 'none')
      .send(tile)
  }
  else {
    reply.status(404).send()
  }

};



async function getCollectionMapTilesets(req, reply) {
  const { collectionId } = req.params;
  const { contentType } = req;

  if (contentType == "html") return reply.view("maptilesets", { baseurl: this.baseurl, collectionId });

  let collection ={ 
    ...modelCommon.getCollection(this.db, collectionId),
    tileMatrixSetLimits: model.getTileMatrixSetLimits(this.db, collectionId)
  };

  reply.send(templates.collectionMapTileSets(this.baseurl, collection));
};


async function getCollectionMapTileset(req, reply) {
  const { collectionId } = req.params;

  let collection ={ 
    ...modelCommon.getCollection(this.db, collectionId),
    tileMatrixSetLimits: model.getTileMatrixSetLimits(this.db, collectionId)
  };

  reply.send(templates.collectionMapTileSet(this.baseurl, collection));
};

async function getCollectionMapTile(req, reply) {
  const { collectionId, tileMatrix, tileRow, tileCol } = req.params;
  let tile = await model.getCollectionTile(this.db, collectionId, tileMatrix, tileRow, tileCol)
  if (tile) {
    if (typeof tile == "object") tile = Buffer.from(tile)
    const format = await filetypemime(tile);
    const gzip = await isGzip(tile)
    reply
      .header('Content-Type', format[0] || 'application/vnd.mapbox-vector-tile')
      .header('Content-Encoding', gzip ? 'gzip' : 'none')
      .send(tile)
  }
  else {
    reply.status(404).send()
  }

};



async function getTileMatrixSets(req, reply) {
  const { f } = req.query;

  const contentType = f || req.accepts().type(['json', 'html']) || "json";
  if (contentType == "html") reply.view("tileMatrixSets", { baseurl: this.baseurl });

  const tileMatrixSets = await model.getTileMatrixSets()
  reply.send(templates.tileMatrixSets(this.baseurl, tileMatrixSets))

};

async function getTileMatrixSet(req, reply) {
  const { f } = req.query;
  const { tileMatrixSetId } = req.params;

  const tileMatrixSet = await model.getTileMatrixSet(tileMatrixSetId)
  const tileMatrices = await model.getTileMatrices(tileMatrixSetId);

  const templated = templates.tileMatrixSet(this.baseurl, tileMatrixSet, tileMatrices)

  const contentType = f || req.accepts().type(['json', 'html']) || "json";
  if (contentType == "html") reply.view("tileMatrixSet", { baseurl: this.baseurl, tileMatrixSetId, templated });

  reply.send(templated);

};


export {
  getCollectionTilesets,
  getCollectionTileset,
  getCollectionTile,

  getCollectionMapTilesets,
  getCollectionMapTileset,
  getCollectionMapTile,

  getTileMatrixSets,
  getTileMatrixSet
}