import * as model from "../database/styles.js";
import * as templates from "../templates/styles.js";
import * as helpers from "../helpers/styles.js";


async function getStyles(req, reply) {
    const { baseurl, db } = this;
    const { contentType } = req;

    if (contentType == "html") return reply.view("styles", { baseurl });
    else {
        const styles = await model.getStyles(db);
        reply.send(templates.styles(baseurl, styles));
    }
};

async function getStyle(req, reply) {
    const { baseurl, db } = this;
    const { contentType } = req;

    const format = contentType.toUpperCase();

    const { styleId } = req.params;

    if (!["MBS", "HTML"].includes(format)) reply.callNotFound();

    else if (format == "HTML") return reply.view("style", { baseurl, styleId });

    else {
        let stylesheet = await model.getStylesheet(db, styleId)
        if (!stylesheet && styleId == "default") return reply.send(templates.emptyStylesheet(baseurl))
        if (!stylesheet) reply.callNotFound();

        stylesheet = stylesheet.replaceAll("{baseurl}", baseurl)
        reply.send(stylesheet)
    }
};


async function getResources(req, reply) {
    const { baseurl, db } = this;
    const { contentType } = req;

    if (contentType == "json") {
        const resources = model.getResources(db);
        reply.type('application/json').send(templates.resources(this.baseurl, resources));
    }
    else {
        return reply.view("resources", { baseurl });
    }
};

async function getResource(req, reply) {
    const { db } = this;
    const { resourceId } = req.params;

    const resources = model.getResource(db, resourceId);

    reply.send(resources);
};


async function getCollectionStyles(req, reply) {
    const { baseurl, db } = this;

    const { contentType } = req;
    const { collectionId } = req.params;

    if (contentType == "html") return reply.view("collectionstyles", { baseurl, collectionId });
    else {
        const styles = await model.getCollectionStyles(db, collectionId).catch((err) => ({}));

        if (styles.length > 0) reply.send(templates.collectionStyles(baseurl, collectionId, styles));
        else reply.send(helpers.generateCollectionStyles(baseurl, collectionId));
    }

};

async function getCollectionStyle(req, reply) {
    const { baseurl, db } = this;

    const { collectionId, styleId } = req.params;
    const { contentType } = req;
    const format = contentType.toUpperCase()
    if (!["MBS", "SLD", "QML", "HTML"].includes(format)) reply.callNotFound();

    else if (format == "HTML") return reply.view("collectionstyle", { baseurl, collectionId, styleId });

    else {
        let stylesheet;
        if (styleId == "default") stylesheet = helpers.generateDefaultStylesheet(db, baseurl, collectionId)
        else if (format == "MBS") stylesheet = await helpers.convertStyleToMBS(baseurl, db, collectionId, styleId)
        else stylesheet = model.getCollectionStylesheet(db, collectionId, styleId, format)

        reply.send(stylesheet)
    }

};


export {
    getStyles,
    getStyle,

    getResources,
    getResource,

    getCollectionStyles,
    getCollectionStyle
}