import * as Common from "./routes/common.js";
import * as Features from "./routes/features.js";
import * as Tiles from "./routes/tiles.js";
import * as Styles from "./routes/styles.js";

class Service {
    constructor(fastify, baseurl, webapp) {
        this.db = fastify.db;
        this.api = fastify.api;
        this.fastify = fastify;

        this.baseurl = baseurl;
        this.webapp = webapp;
    }
}

Object.assign(Service.prototype, {
    ...Common,
    ...Features,
    ...Tiles,
    ...Styles
});

export { Service }