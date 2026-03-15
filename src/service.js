import * as Common from "./routes/common.js";
import * as Features from "./routes/features.js";
import * as Tiles from "./routes/tiles.js";
import * as Styles from "./routes/styles.js";

const Service = {
    ...Common,
    ...Features,
    ...Tiles,
    ...Styles
};

export { Service }