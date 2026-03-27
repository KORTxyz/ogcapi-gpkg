import { readdir } from 'node:fs/promises';
import { basename, join } from 'node:path';

import {initDb} from '../database/init.js'

const expandAPI = api => {
     // Add dataset path parameter to components
        api.components = api.components || {};
        api.components.parameters = api.components.parameters || {};
        api.components.parameters.dataset = {
            name: 'dataset',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Dataset identifier (GeoPackage filename without extension)'
        };

        const datasetRef = { $ref: '#/components/parameters/dataset' };
        const existingPaths = Object.entries(api.paths);
        const newPaths = {};

        // Add root datasets listing
        newPaths['/'] = {
            get: {
                summary: 'List available datasets',
                operationId: 'getDatasets',
                tags: ['Capabilities'],
                parameters: [],
                responses: { 200: { description: 'List of datasets' } }
            }
        };

        for (const [path, pathItem] of existingPaths) {
            const newPath = '/{dataset}' + (path === '/' ? '' : path);
            const newPathItem = JSON.parse(JSON.stringify(pathItem));
            for (const method of ['get','post','put','patch','delete','head','options']) {
                if (newPathItem[method]) {
                    newPathItem[method].parameters = [datasetRef, ...(newPathItem[method].parameters || [])];
                }
            }
            newPaths[newPath] = newPathItem;
        }

        api.paths = newPaths;
}

const initDbMap = async (map, folderPath) => {
    const files = await readdir(folderPath);
    const gpkgFiles = files.filter(f => f.endsWith('.gpkg'));
    for (const file of gpkgFiles) addDb(map,join(folderPath,file))
};

const addDb = async (map,file,initialMetadata) => {
    const key = basename(file, '.gpkg');
    const {db,metadata} = await initDb(file,initialMetadata);
    map.set(key, {db,metadata});
};




export {
    expandAPI,
    initDbMap,
    addDb
}