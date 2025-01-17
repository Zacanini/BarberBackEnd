const request = require('supertest');
const express = require('express');
const router = require('../ShopRouter');
const authMiddleware = require('../../middlewares/authMiddleware');
const shopController = require('../../controllers/ShopController');

// FILE: src/routes/ShopRouter.test.js


jest.mock('../../middlewares/authMiddleware');
jest.mock('../../controllers/ShopController');

const app = express();
app.use(express.json());
app.use('/api', router);

describe('ShopRouter', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('POST /shops should call authMiddleware', async () => {
        authMiddleware.mockImplementation((req, res, next) => next());
        shopController.criarShop.mockImplementation((req, res) => res.status(201).send());

        await request(app).post('/api/shops').send({ name: 'Test Shop' });

        expect(authMiddleware).toHaveBeenCalled();
    });

    test('GET /shops should call authMiddleware', async () => {
        authMiddleware.mockImplementation((req, res, next) => next());
        shopController.listarShops.mockImplementation((req, res) => res.status(200).send());

        await request(app).get('/api/shops');

        expect(authMiddleware).toHaveBeenCalled();
    });

    test('GET /shops/:id should call authMiddleware', async () => {
        authMiddleware.mockImplementation((req, res, next) => next());
        shopController.obterShopPorId.mockImplementation((req, res) => res.status(200).send());

        await request(app).get('/api/shops/1');

        expect(authMiddleware).toHaveBeenCalled();
    });

    test('PUT /shops/:id should call authMiddleware', async () => {
        authMiddleware.mockImplementation((req, res, next) => next());
        shopController.atualizarShop.mockImplementation((req, res) => res.status(200).send());

        await request(app).put('/api/shops/1').send({ name: 'Updated Shop' });

        expect(authMiddleware).toHaveBeenCalled();
    });

    test('DELETE /shops/:id should call authMiddleware', async () => {
        authMiddleware.mockImplementation((req, res, next) => next());
        shopController.deletarShop.mockImplementation((req, res) => res.status(204).send());

        await request(app).delete('/api/shops/1');

        expect(authMiddleware).toHaveBeenCalled();
    });
});