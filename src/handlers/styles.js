const { baseurl } = process.env;

const templates = require('../templates/styles');
const model = require('../model/styles');


const getStyles = async (req, reply, fastify) => {
    const { f } = req.query;
    const styles = model.getStyles();
    console.log(styles)
    if (f == "json") {
        reply.type('application/json').send(templates.styles(styles));
    }
    else {
        return reply.view("styles");
    }
};

const getStyle = async (req, reply, fastify) => {

    const { styleId } = req.params;
    const { f } = req.query;

    const style = await model.getStyle(styleId)
    
    if(!style) reply.code(404).send();
    const { stylesheet } = style;

    if (f == "mbs") {
        reply.type('application/json').send(stylesheet.replaceAll("baseurl:/",baseurl));
    }

    else {
        return reply.view("style", { baseurl, styleId });
    }


};

const getResources = async (req, reply, fastify) => {
    const { f } = req.query;
    const resources = model.getResources();

    if (f == "json") {
        reply.type('application/json').send(resources);
    }
    else {
        return reply.view("styles");
    }
};

const getResource = async (req, reply, fastify) => {
    const { resourceId } = req.params;

    const resources = model.getResource(resourceId);

    reply.send(resources);
};

module.exports = {
    getStyles,
    getStyle,
    getResources,
    getResource
  }