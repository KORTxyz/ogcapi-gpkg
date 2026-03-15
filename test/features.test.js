import assert from 'node:assert';
import test from 'node:test';


import build from './app.js';

test('Testing OGC API - Features spec', async (t) => {
    // The setTimeout() in the following subtest would cause it to outlive its
    // parent test if 'await' is removed on the next line. Once the parent test
    // completes, it will cancel any outstanding subtests.
    const app = build()

    await t.test('requests the "/dummydata/collections/points" route', async t => {
        const response = await app.inject({
            method: 'GET',
            url: '/dummydata/collections/points'
        })
        assert.equal(response.statusCode, 200, 'returns a status code of 200')
    });


    await t.test('requests the "/dummydata/collections/points" route', async t => {
        const response = await app.inject({
            method: 'GET',
            url: '/dummydata/collections/points/items'
        })
        assert.equal(response.statusCode, 200, 'returns a status code of 200')
    });

    await t.test('requests "/dummydata/collections/points/items?integer=35" route (No data)', async t => {
        const response = await app.inject({
            method: 'GET',
            url: '/dummydata/collections/points/items?integer=35'
        })
        assert.equal(response.json().features.length, 0, 'returns 0 features')
    });

    await t.test('requests the "/dummydata/collections/points/items?integer=3543" route', async t => {
        const response = await app.inject({
            method: 'GET',
            url: '/dummydata/collections/points/items?integer=3543'
        })
        assert.equal(response.json().features.length, 1, 'returns 1 features')
    });

    await t.test('requests the "/dummydata/collections/points/items?bbox=12,56,13,57" route (No data)', async t => {
        const response = await app.inject({
            method: 'GET',
            url: '/dummydata/collections/points/items?bbox=12,56,13,57'
        })
        assert.equal(response.json().features.length, 0, 'returns 0 features')
    });

    await t.test('requests the "/dummydata/collections/points/items?bbox=12,55,13,56" route', async t => {
        const response = await app.inject({
            method: 'GET',
            url: '/dummydata/collections/points/items?bbox=12,55,13,56'
        })
        assert.equal(response.json().features.length, 4, 'returns 4 features')
    });
    
await t.test('requests the "/dummydata/collections/points/items/1', async t => {
        const response = await app.inject({
            method: 'GET',
            url: '/dummydata/collections/points/items/1'
        })
        assert.equal(response.statusCode, 200, 'returns a status code of 200')
    });

    await t.test('requests the "/dummydata/collections/points/items/2" route', async t => {
        const response = await app.inject({
            method: 'GET',
            url: '/dummydata/collections/points/items/99'
        })
        assert.equal(response.statusCode, 404, 'returns a status code of 200')
    });


    await t.test('requests the "/dummydata/collections/points/items/schema', async t => {
        const response = await app.inject({
            method: 'GET',
            url: '/dummydata/collections/points/schema'
        })
        assert.equal(response.statusCode, 200, 'returns a status code of 200')
    });
});
