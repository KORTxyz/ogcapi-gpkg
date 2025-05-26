import assert from 'node:assert';
import test from 'node:test';


import build from './app.js';

test('Testing OGC API - Styles spec', async (t) => {
    // The setTimeout() in the following subtest would cause it to outlive its
    // parent test if 'await' is removed on the next line. Once the parent test
    // completes, it will cancel any outstanding subtests.
    const app = build()

    await t.test('requests the "/styles" route', async t => {
        const response = await app.inject({
            method: 'GET',
            url: '/styles'
        })
        assert.equal(response.statusCode, 200, 'returns a status code of 200')
    });

    await t.test('requests the "/collections/building/styles" route', async t => {
        const response = await app.inject({
            method: 'GET',
            url: '/collections/building/styles'
        })
        assert.equal(response.statusCode, 200, 'returns a status code of 200')
    });

    await t.test('requests the "/collections/building/styles/building?f=html" route', async t => {
        const response = await app.inject({
            method: 'GET',
            url: '/collections/building/styles/building?f=html'
        })
        assert.equal(response.statusCode, 200, 'returns a status code of 200')
    });

    await t.test('requests the "/collections/building/styles/building?f=sld" route', async t => {
        const response = await app.inject({
            method: 'GET',
            url: '/collections/building/styles/building?f=sld'
        })
        assert.equal(response.statusCode, 200, 'returns a status code of 200')
    });
    
    await t.test('requests the "/collections/building/styles/building?f=mbs" route', async t => {
        const response = await app.inject({
            method: 'GET',
            url: '/collections/building/styles/building?f=mbs'
        })
        assert.equal(response.statusCode, 200, 'returns a status code of 200')
    });
});
