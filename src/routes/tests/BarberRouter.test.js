const request = require('supertest');
const express = require('express');
const router = require('../BarberRouter');
const authMiddleware = require('../../middlewares/authMiddleware');
const barberController = require('../../controllers/BarberController');

// FILE: src/routes/BarberRouter.test.js


jest.mock('../../middlewares/authMiddleware');
jest.mock('../../controllers/BarberController');

const app = express();
app.use(express.json());
app.use('/api', router);

describe('BarberRouter', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('POST /barbers should call authMiddleware', async () => {
        authMiddleware.mockImplementation((req, res, next) => next());
        barberController.criarBarber.mockImplementation((req, res) => res.status(201).send());

        await request(app).post('/api/barbers').send({ name: 'Test Barber' });

        expect(authMiddleware).toHaveBeenCalled();
    });

    test('GET /barbers should call authMiddleware', async () => {
        authMiddleware.mockImplementation((req, res, next) => next());
        barberController.listarBarbers.mockImplementation((req, res) => res.status(200).send());

        await request(app).get('/api/barbers');

        expect(authMiddleware).toHaveBeenCalled();
    });

    test('GET /barbers/:id should call authMiddleware', async () => {
        authMiddleware.mockImplementation((req, res, next) => next());
        barberController.obterBarberPorId.mockImplementation((req, res) => res.status(200).send());

        await request(app).get('/api/barbers/1');

        expect(authMiddleware).toHaveBeenCalled();
    });

    test('PUT /barbers/:id should call authMiddleware', async () => {
        authMiddleware.mockImplementation((req, res, next) => next());
        barberController.atualizarBarber.mockImplementation((req, res) => res.status(200).send());

        await request(app).put('/api/barbers/1').send({ name: 'Updated Barber' });

        expect(authMiddleware).toHaveBeenCalled();
    });

    test('DELETE /barbers/:id should call authMiddleware', async () => {
        authMiddleware.mockImplementation((req, res, next) => next());
        barberController.deletarBarber.mockImplementation((req, res) => res.status(204).send());

        await request(app).delete('/api/barbers/1');

        expect(authMiddleware).toHaveBeenCalled();
    });
});