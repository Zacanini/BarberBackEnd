const request = require('supertest');
const express = require('express');
const router = require('../UserRouter');
const authMiddleware = require('../../middlewares/authMiddleware');
const userController = require('../../controllers/UserController');

// FILE: src/routes/UserRouter.test.js


jest.mock('../../middlewares/authMiddleware');
jest.mock('../../controllers/UserController');

const app = express();
app.use(express.json());
app.use('/api', router);

describe('UserRouter', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('POST /users should call authMiddleware', async () => {
        authMiddleware.mockImplementation((req, res, next) => next());
        userController.criarUser.mockImplementation((req, res) => res.status(201).send());

        await request(app).post('/api/users').send({ name: 'Test User' });

        expect(authMiddleware).toHaveBeenCalled();
    });

    test('GET /users should call authMiddleware', async () => {
        authMiddleware.mockImplementation((req, res, next) => next());
        userController.listarUsers.mockImplementation((req, res) => res.status(200).send());

        await request(app).get('/api/users');

        expect(authMiddleware).toHaveBeenCalled();
    });

    test('GET /users/:id should call authMiddleware', async () => {
        authMiddleware.mockImplementation((req, res, next) => next());
        userController.obterUserPorId.mockImplementation((req, res) => res.status(200).send());

        await request(app).get('/api/users/1');

        expect(authMiddleware).toHaveBeenCalled();
    });

    test('PUT /users/:id should call authMiddleware', async () => {
        authMiddleware.mockImplementation((req, res, next) => next());
        userController.atualizarUser.mockImplementation((req, res) => res.status(200).send());

        await request(app).put('/api/users/1').send({ name: 'Updated User' });

        expect(authMiddleware).toHaveBeenCalled();
    });

    test('DELETE /users/:id should call authMiddleware', async () => {
        authMiddleware.mockImplementation((req, res, next) => next());
        userController.deletarUser.mockImplementation((req, res) => res.status(204).send());

        await request(app).delete('/api/users/1');

        expect(authMiddleware).toHaveBeenCalled();
    });
});