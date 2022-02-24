const Flavors = require('./flavors/flavors-model');
const db = require('../data/dbConfig');
const request = require('supertest');
const server = require('./server');

beforeAll(async () => {
    await db.migrate.rollback();
    await db.migrate.latest();
});

beforeEach(async () => {
    await db('flavors').truncate();
});

describe('test the flavors model', () => {
    test('the table is empty', async() => {
        const flavors = await db('flavors');
        expect(flavors).toHaveLength(0);
    });

    test('flavors get inserted', async() => {
        let result = await Flavors.insert({ name: 'vanilla' });
        expect(result).toEqual({ name: 'vanilla', id: 1 });
        let flavors = await db('flavors');
        expect(flavors).toHaveLength(1);

        await Flavors.insert({ name: 'cookie dough' });
        flavors = await db('flavors');
        expect(flavors).toHaveLength(2);
    });
});

describe('test server endpoints', () => {
    test('call the up endpoint', async() => {
        const result = await request(server).get('/');
        expect(result.status).toBe(200);
        expect(result.body).toEqual({ api: 'up' });
    });

    test('[GET] /flavors', async() => {
        let result = await request(server).get('/flavors');
        expect(result.status).toBe(200);
        expect(result.body).toHaveLength(0);
        await Flavors.insert({ name: 'mint' });
        result = await request(server).get('/flavors');
        expect(result.body).toHaveLength(1);
    });
});