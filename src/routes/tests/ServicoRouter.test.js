const request = require('supertest');
const express = require('express');
const router = require('../ServicoRouter');
const authMiddleware = require('../../middlewares/authMiddleware');
const servicoController = require('../../controllers/ServicoController');

// FILE: src/routes/ServicoRouter.test.js


jest.mock('../../middlewares/authMiddleware');
jest.mock('../../controllers/ServicoController');

const app = express();
app.use(express.json());
app.use('/api', router);

describe('ServicoRouter', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('POST /servicos should call authMiddleware', async () => {
        authMiddleware.mockImplementation((req, res, next) => next());
        servicoController.criarServico.mockImplementation((req, res) => res.status(201).send());

        await request(app).post('/api/servicos').send({ name: 'Test Servico' });

        expect(authMiddleware).toHaveBeenCalled();
    });

    test('GET /servicos should call authMiddleware', async () => {
        authMiddleware.mockImplementation((req, res, next) => next());
        servicoController.listarServicos.mockImplementation((req, res) => res.status(200).send());

        await request(app).get('/api/servicos');

        expect(authMiddleware).toHaveBeenCalled();
    });

    test('GET /servicos/:id should call authMiddleware', async () => {
        authMiddleware.mockImplementation((req, res, next) => next());
        servicoController.obterServicoPorId.mockImplementation((req, res) => res.status(200).send());

        await request(app).get('/api/servicos/1');

        expect(authMiddleware).toHaveBeenCalled();
    });

    test('PUT /servicos/:id should call authMiddleware', async () => {
        authMiddleware.mockImplementation((req, res, next) => next());
        servicoController.atualizarServico.mockImplementation((req, res) => res.status(200).send());

        await request(app).put('/api/servicos/1').send({ name: 'Updated Servico' });

        expect(authMiddleware).toHaveBeenCalled();
    });

    test('DELETE /servicos/:id should call authMiddleware', async () => {
        authMiddleware.mockImplementation((req, res, next) => next());
        servicoController.deletarServico.mockImplementation((req, res) => res.status(204).send());

        await request(app).delete('/api/servicos/1');

        expect(authMiddleware).toHaveBeenCalled();
    });
});