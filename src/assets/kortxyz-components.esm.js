import { B as BUILD, c as consoleDevInfo, H, w as win, N as NAMESPACE, p as promiseResolve, g as globalScripts, b as bootstrapLazy } from './index-DoE5X9BW.js';
export { s as setNonce } from './index-DoE5X9BW.js';

/*
 Stencil Client Patch Browser v4.37.1 | MIT Licensed | https://stenciljs.com
 */

var patchBrowser = () => {
  if (BUILD.isDev && !BUILD.isTesting) {
    consoleDevInfo("Running in development mode.");
  }
  if (BUILD.cloneNodeFix) {
    patchCloneNodeFix(H.prototype);
  }
  const scriptElm = BUILD.scriptDataOpts ? win.document && Array.from(win.document.querySelectorAll("script")).find(
    (s) => new RegExp(`/${NAMESPACE}(\\.esm)?\\.js($|\\?|#)`).test(s.src) || s.getAttribute("data-stencil-namespace") === NAMESPACE
  ) : null;
  const importMeta = import.meta.url;
  const opts = BUILD.scriptDataOpts ? (scriptElm || {})["data-opts"] || {} : {};
  if (importMeta !== "") {
    opts.resourcesUrl = new URL(".", importMeta).href;
  }
  return promiseResolve(opts);
};
var patchCloneNodeFix = (HTMLElementPrototype) => {
  const nativeCloneNodeFn = HTMLElementPrototype.cloneNode;
  HTMLElementPrototype.cloneNode = function(deep) {
    if (this.nodeName === "TEMPLATE") {
      return nativeCloneNodeFn.call(this, deep);
    }
    const clonedNode = nativeCloneNodeFn.call(this, false);
    const srcChildNodes = this.childNodes;
    if (deep) {
      for (let i = 0; i < srcChildNodes.length; i++) {
        if (srcChildNodes[i].nodeType !== 2) {
          clonedNode.appendChild(srcChildNodes[i].cloneNode(true));
        }
      }
    }
    return clonedNode;
  };
};

patchBrowser().then(async (options) => {
  await globalScripts();
  return bootstrapLazy([["kortxyz-ogcapi-collectionlist",[[257,"kortxyz-ogcapi-collectionlist",{"url":[8]}]]],["kortxyz-list",[[257,"kortxyz-list",{"data":[8],"group":[8],"header":[8],"name":[8],"description":[8],"uploadtile":[4],"accept":[8],"items":[32],"addUploadingTile":[64]}]]],["kortxyz-sidebar-button",[[257,"kortxyz-sidebar-button",{"placement":[1],"icon":[1]}]]],["kortxyz-aggrid",[[256,"kortxyz-aggrid",{"data":[1],"schema":[1032],"store":[1],"editable":[4]},[[16,"featureClicked","featureClickedHandler"]]]]],["kortxyz-codemirror",[[257,"kortxyz-codemirror",{"store":[1],"value":[1025],"language":[1],"theme":[1]}]]],["kortxyz-datastore",[[1,"kortxyz-datastore",{"store":[1],"data":[1],"sync":[4],"transform":[1]}]]],["kortxyz-dragoverlay",[[257,"kortxyz-dragoverlay",{"target":[8],"visible":[32]},[[0,"dragover","onDragOver"],[0,"dragenter","onDragStart"],[9,"dragleave","onDragEnd"],[0,"drop","onDrop"]]]]],["kortxyz-maplibre",[[0,"kortxyz-maplibre",{"map":[1040],"mapstyle":[1],"basemapstyle":[1],"basemaps":[1],"mapboxkey":[1],"cooperativeGestures":[4,"cooperative-gestures"],"center":[1],"zoom":[2],"bbox":[1],"hoverpopup":[4],"showTileBoundaries":[4,"show-tile-boundaries"],"legend":[8],"navigation":[4],"gps":[4],"fullscreen":[4],"togglebutton":[1],"scalebar":[4],"draw":[1],"editGeometry":[64],"getGeolocate":[64]}]]],["kortxyz-maplibre-layerlist",[[257,"kortxyz-maplibre-layerlist",{"mapstyle":[32],"selectedLayer":[32]},[[4,"openPanel","onSidebarOpen"]]]]],["kortxyz-maplibre-searchbox",[[257,"kortxyz-maplibre-searchbox",{"url":[1],"result":[1],"resultzoom":[2],"resulttype":[1],"results":[32]}]]],["kortxyz-shell",[[257,"kortxyz-shell",{"hasSlotContent":[32]}]]],["kortxyz-sidebar",[[257,"kortxyz-sidebar",{"panelActive":[32]}]]],["kortxyz-sidebar-panel",[[257,"kortxyz-sidebar-panel",{"closed":[4]}]]],["kortxyz-tauchart",[[0,"kortxyz-tauchart",{"data":[1],"store":[1],"type":[1],"y":[1],"x":[1],"color":[1],"colorbrewer":[1],"groupByKeys":[1,"group-by-keys"],"tooltip":[4],"legend":[4]}]]],["kortxyz-maplibre-layer",[[1,"kortxyz-maplibre-layer",{"layerid":[1],"sourceLayer":[1,"source-layer"],"type":[1],"filter":[8],"paint":[1032],"layout":[1032],"legendMetadata":[1032,"legend-metadata"],"popup":[8],"clicklink":[8],"proximity":[2]},[[8,"rowClicked","rowClickedHandler"]]]]],["kortxyz-maplibre-source",[[1,"kortxyz-maplibre-source",{"sourceid":[1],"type":[1],"data":[1],"store":[1],"tiles":[1],"tilesize":[2],"maxzoom":[2],"fit":[4],"source":[1032],"autolayers":[32],"addSource":[64]}]]],["kortxyz-icon",[[257,"kortxyz-icon",{"icon":[1],"size":[1],"color":[1]}]]]], options);
});
//# sourceMappingURL=kortxyz-components.esm.js.map
