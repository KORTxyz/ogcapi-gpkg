import * as model from "../database/styles.js";
import * as templates from "../templates/styles.js";

async function getStyles(req, reply) {
    const { contentType } = req;

    const { f } = req.query;

    const styles = await model.getStyles(this.db);

    if (["JSON", "HTML"].includes(contentType)) reply.callNotFound();
    else if (contentType == "html") return reply.view("styles");

    else reply.send(templates.styles(this.baseurl, styles))

};

async function getStyle(req, reply) {
    const { styleId } = req.params;
    const { f } = req.query;

    const contentType = f || req.accepts().type(['json', 'html']) || "json";
    const format = contentType.toUpperCase()

    if (!["MBS", "HTML"].includes(format)) reply.callNotFound();

    else if (format == "HTML") return reply.view("style", { baseurl: this.baseurl, styleId });

    else {
        let stylesheet = await model.getStylesheet(this.db, styleId)
        stylesheet = stylesheet.replaceAll("{baseurl}", this.baseurl)
        console.log(this.baseurl)
        reply.send(stylesheet)
    }

};

async function getResources(req, reply) {
    const { f } = req.query;

    if (f == "json") {
        const resources = model.getResources(this.db);
        console.log(resources)
        reply.type('application/json').send(templates.resources(this.baseurl,resources));
    }
    else {
        return reply.view("resources");
    }
};

async function getResource(req, reply) {
    const { resourceId } = req.params;

    const resources = model.getResource(this.db, resourceId);

    reply.send(resources);
};

async function getCollectionStyles(req, reply) {
    const { contentType } = req;
    const { collectionId } = req.params;

    if (contentType == "html") return reply.view("collectionstyles", { collectionId });
    else {
        const styles = await model.getCollectionStyles(this.db, collectionId).catch((err) => ({}));

        if (styles.length > 0) reply.send(templates.collectionStyles(this.baseurl, collectionId, styles));
        else reply.send(templates.generateCollectionStyles(this.baseurl, collectionId));
    }

};

async function getCollectionStyle(req, reply) {
    const { collectionId, styleId } = req.params;
    const { f } = req.query;

    const contentType = f || req.accepts().type(['json', 'html']) || "json";
    const format = contentType.toUpperCase()

    if (!["MBS", "SLD", "QML", "HTML"].includes(format)) reply.callNotFound();

    else if (format == "HTML") return reply.view("collectionstyle", { baseurl: this.baseurl, collectionId, styleId });

    else {
        let stylesheet;
        if (styleId == "default") stylesheet = templates.generateDefaultStylesheet(this.db, this.baseurl, collectionId)
        else if (format == "MBS") stylesheet = await templates.convertStyleToMBS(this.baseurl, this.db, collectionId, styleId)
        else stylesheet = model.getCollectionStylesheet(this.db, collectionId, styleId, format)

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