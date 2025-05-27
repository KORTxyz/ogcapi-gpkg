import assert from 'node:assert';
import test from 'node:test';


import build from './app.js';

test('Testing OGC API - Tiles spec', async (t) => {
    // The setTimeout() in the following subtest would cause it to outlive its
    // parent test if 'await' is removed on the next line. Once the parent test
    // completes, it will cancel any outstanding subtests.
    const app = build()

    await t.test('requests the "/tiles" route', async t => {
        const response = await app.inject({
            method: 'GET',
            url: '/tiles'
        })
        assert.equal(response.statusCode, 200, 'returns a status code of 200')
    });

    await t.test('requests the "/collections/points/tiles" route', async t => {
        const response = await app.inject({
            method: 'GET',
            url: '/collections/points/tiles'
        })
        assert.equal(response.statusCode, 200, 'returns a status code of 200')
    });


});
