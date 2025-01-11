import * as Common from "./routes/common.js";
import * as Features from "./routes/features.js";
import * as Tiles from "./routes/tiles.js";
import * as Styles from "./routes/styles.js";

class Service {
    constructor(fastify, baseurl) {
        this.db = fastify.db;
        this.api = fastify.api;
        this.baseurl = baseurl;
        this.fastify = fastify;
    }
}

Object.assign(Service.prototype, {
    ...Common,
    ...Features,
    ...Tiles,
    ...Styles
});

export { Service }