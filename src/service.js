import * as Common from "./handlers/common.js";
import * as Features from "./handlers/features.js";
import * as Tiles from "./handlers/tiles.js";
import * as Styles from "./handlers/styles.js";

class Service {
    constructor(fastify, baseurl) {
        console.log(fastify.api.servers)
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

