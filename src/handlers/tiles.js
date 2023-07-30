const { baseurl } = process.env;

const templates = require('../templates/tiles');
const model = require('../model/tiles');

const imageType = require('image-type')
const isGzip = require('is-gzip');

const getTileMatrixSets = async (req, reply, fastify) => {
  const { f } = req.query;

  const contentType = f || req.accepts().type(['json', 'html']) || "json";
  if (contentType == "html") reply.view("tileMatrixSets", { baseurl });

  const tileMatrixSets = await model.getTileMatrixSets()
  reply.send(templates.tileMatrixSets(tileMatrixSets))


}

const getTileMatrixSet = async (req, reply, fastify) => {
  const { f } = req.query;
  const { tileMatrixSetId } = req.params;

  const tileMatrixSet = await model.getTileMatrixSet(tileMatrixSetId)
  const tileMatrices = await model.getTileMatrices(tileMatrixSetId);

  const templated = templates.tileMatrixSet(tileMatrixSet, tileMatrices)

  const contentType = f || req.accepts().type(['json', 'html']) || "json";
  if (contentType == "html") reply.view("tileMatrixSet", { baseurl, tileMatrixSetId, templated });
  
  reply.send(templated);

}

const getCollectionTilesets = async (req, reply, fastify) => {
  const { collectionId } = req.params;
  const { f } = req.query;

  const contentType = f || req.accepts().type(['json', 'html']) || "json";
  if (contentType == "html") reply.view("tilesets", { baseurl, collectionId });

  const collection = model.getCollectionMetadata(collectionId);
  reply.send(templates.tilesets(collection));

}

const getCollectionTileset = async (req, reply, fastify) => {
  const { collectionId } = req.params;

  const { f } = req.query;

  const collection = model.getCollectionMetadata(collectionId)

  const contentType = f || req.accepts().type(['json', 'html']) || "json";
  if (contentType == "html") reply.view("tileset", { baseurl, collectionId });

  const vectorLayers = collection["data_type"] == "tiled-features" ? model.getVectorLayers(collectionId) : [];
  if (f == "tilejson") reply.schema("tilejson").send(templates.tilejson(collection, vectorLayers));
  reply.send(templates.tileset(collection))

}

const getCollectionTile = async (req, reply, fastify) => {
  const { collectionId, tileMatrix, tileRow, tileCol } = req.params;

  let tile = await model.getCollectionTile(collectionId, tileMatrix, tileRow, tileCol)
  if (tile) {
    if (typeof tile == "object") tile = Buffer.from(tile)

    const format = await imageType(tile)
    const gzip = await isGzip(tile)

    reply
      .header('Content-Type', format?.mime || 'application/vnd.mapbox-vector-tile')
      .header('Content-Encoding', gzip ? 'gzip' : 'none')
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