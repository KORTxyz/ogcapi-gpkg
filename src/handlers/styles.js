const { baseurl } = process.env;

const templates = require('../templates/styles');
const model = require('../model/styles');


const getStyles = async (req, reply, fastify) => {
    const { f } = req.query;
    const styles = model.getStyles();

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


    if (f == "mbs") {
        const style = await model.getStyle(styleId,"mbstyle")
        if(!style) reply.code(404).send();
        const { stylesheet } = style;
        reply.type('application/json').send(stylesheet.toString().replaceAll("baseurl:/",baseurl));
    }

    else {
        return reply.view("style", { baseurl, styleId });
    }


};

const getResources = async (req, reply, fastify) => {
    const { f } = req.query;

    if (f == "json") {
        const resources = model.getResources();
        reply.type('application/json').send(templates.resources(resources));
    }
    else {
        return reply.view("resources");
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