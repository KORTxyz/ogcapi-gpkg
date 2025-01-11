import * as model from "../database/styles.js";
import * as templates from "../templates/styles.js";

async function getStyles(req, reply) {
    const { contentType } = req;

    const { f } = req.query;

    const styles = model.getStyles(this.db);

    if (["JSON", "HTML"].includes(contentType)) reply.status(404);
    else if (contentType == "html") return reply.view("styles");

    else reply.send(templates.styles(this.baseurl, null, styles))

};

async function getCollectionStyles(req, reply) {
    const { contentType } = req;
    const { collectionId } = req.params;

    if (contentType == "html") return reply.view("styles", { collectionId });
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

    else if (format == "HTML") return reply.view("style", {  baseurl: this.baseurl, collectionId, styleId });

    else {
        let stylesheet;
        if(styleId == "default") stylesheet = templates.generateDefaultStylesheet(this.db, this.baseurl, collectionId)
        else if (format == "MBS") stylesheet = await templates.convertStyleToMBS(this.baseurl, this.db, collectionId, styleId)
        else stylesheet = model.getCollectionStylesheet(this.db, collectionId, styleId, format)

        reply.send(stylesheet)
    }

};


export {
    getStyles,
    getCollectionStyles,
    getCollectionStyle
}