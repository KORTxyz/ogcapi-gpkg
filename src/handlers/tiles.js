const { baseurl } = process.env;

const templates = require('../templates/tiles');
const model = require('../model/tiles');

const imageType = require('image-type')
const isGzip = require('is-gzip');

const getTileMatrixSets = async (req, reply, fastify) => {
  const { f } = req.query;

  if (f == "json") {
    const tileMatrixSets = await model.getTileMatrixSets()
    reply.send(templates.tileMatrixSets(tileMatrixSets))
  }
  else {
    return reply.view("tileMatrixSets", { baseurl });
  }

}

const getTileMatrixSet = async (req, reply, fastify) => {
  const { f } = req.query;
  const { tileMatrixSetId } = req.params;

  const tileMatrixSet = await model.getTileMatrixSet(tileMatrixSetId)
  const tileMatrices = await model.getTileMatrices(tileMatrixSetId);

  const templated = templates.tileMatrixSet(tileMatrixSet, tileMatrices)

  if (f == "json") reply.send(templated)
  else return reply.view("tileMatrixSet", { baseurl, tileMatrixSetId, templated });

}

const getCollectionTilesets  = async (req, reply, fastify) => {
  const { collectionId } = req.params;
  const { f } = req.query;
   
  if (f == "json") {
    const collection = model.getCollectionMetadata(collectionId)
    reply.send(templates.tilesets(collection))
  }
  else {
    return reply.view("tilesets", { baseurl, collectionId });
  }

}

const getCollectionTileset  = async (req, reply, fastify) => {
  const { collectionId, tileMatrixSetId } = req.params;

  const { f } = req.query;

  const collection = model.getCollectionMetadata(collectionId)
  console.log(collection["data_type"])
  const vectorLayers = collection["data_type"] == "tiled-features" ? model.getVectorLayers(collectionId) : [];
  
  if (f == "json") {
    reply.send(templates.tileset(collection))
  }
  else if (f == "tilejson") {
    reply.schema("tilejson").send(templates.tilejson(collection, vectorLayers))
  }
  else {
    return reply.view("tileset", { baseurl, collectionId });
  }

}

const getCollectionTile = async (req, reply, fastify) => {
  const { collectionId, tileMatrix, tileRow, tileCol } = req.params;

  let tile = await model.getCollectionTile(collectionId, tileMatrix, tileRow, tileCol)
  if (tile) {
    if(typeof tile == "object") tile = Buffer.from(tile)

    const format = await imageType(tile)
    const gzip = await isGzip(tile)
    
    reply
      .header('Content-Type', format?.mime || 'application/vnd.mapbox-vector-tile')
      .header('Content-Encoding', gzip? 'gzip':'none')
      .send(tile)
    }
  else {
    reply.status(404).send()
  }

}

module.exports = {
  getTileMatrixSets,
  getTileMatrixSet,
  getCollectionTilesets,
  getCollectionTileset,
  getCollectionTile
}