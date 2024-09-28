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

describe('test server endpoints for happy path', () => {
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

    test('[GET] /flavors/:id', async() => {
        let result = await Flavors.insert({ name: 'popcorn' });
        result = await request(server).get('/flavors/' + result.id);
        expect(result.body.name).toBe('popcorn');
    });

    test('[POST] /flavors', async()=> {
        let result = await request(server)
            .post('/flavors')
            .send({ name: 'bacon' });
        expect(result.status).toBe(201);
        result = await Flavors.getById(1);
        expect(result.name).toBe('bacon');
    });

    test('[DELETE] /flavors/:id', async() => {
        let {id} = await Flavors.insert({ name: 'caramel' });
        let result = await request(server).delete('/flavors/' + id);
        expect(result.status).toEqual(200);
        expect(result.body).toEqual({ name: 'caramel', id: 1 });
        const flavors = await db('flavors');
        expect(flavors).toHaveLength(0);
    });

    test('[PUT] /flavors/:id', async() => {
        let {id} = await Flavors.insert({ name: 'grape' });
        let result = await request(server)
            .put('/flavors/' + id)
            .send({ name: 'blueberry' });
        expect(result.body).toEqual({name: 'blueberry', id: 1});
        let flavor = await Flavors.getById(id);
        expect(flavor).toEqual({name: 'blueberry', id: 1});
    });
});

describe('test server endpoints for unhappy path', () => {

    test('[GET] /flavors/:id with improper id', async() => {
        let result = await request(server).get('/flavors/' + 2);
        expect(result.status).toBe(404);
    });

    test('[POST] /flavor without name', async()=> {
        let result = await request(server)
            .post('/flavors')
            .send({ name: '' });
        expect(result.status).toBe(400);
    });

    test('[DELETE] /flavors/:id with improper id', async() => {
        let result = await request(server).delete('/flavors/' + 2);
        expect(result.status).toEqual(404);
    });

    test('[PUT] /flavors/:id with improper id', async() => {
        let result = await request(server)
            .put('/flavors/' + 2)
            .send({ name: 'blueberry' });
        expect(result.status).toEqual(404);
    });
});