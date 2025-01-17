const request = require('supertest');
const express = require('express');
const router = require('../AgendaRouter');
const authMiddleware = require('../../middlewares/authMiddleware');
const agendaController = require('../../controllers/AgendaController');

jest.mock('../../middlewares/authMiddleware');
jest.mock('../../controllers/AgendaController');

const app = express();
app.use(express.json());
app.use('/api', router);

describe('AgendaRouter', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockReq = (method, url, body = {}) => {
        return request(app)[method](url).send(body);
    };

    test('POST /agendas should call authMiddleware and criarAgenda', async () => {
        authMiddleware.mockImplementation((req, res, next) => next());
        agendaController.criarAgenda.mockImplementation((req, res) => res.status(201).json({}));

        await mockReq('post', '/api/agendas', { title: 'Test Agenda' });

        expect(authMiddleware).toHaveBeenCalled();
        expect(agendaController.criarAgenda).toHaveBeenCalled();
    });

    test('GET /agendas should call authMiddleware and listarAgendas', async () => {
        authMiddleware.mockImplementation((req, res, next) => next());
        agendaController.listarAgendas.mockImplementation((req, res) => res.status(200).json([]));

        await mockReq('get', '/api/agendas');

        expect(authMiddleware).toHaveBeenCalled();
        expect(agendaController.listarAgendas).toHaveBeenCalled();
    });

    test('GET /agendas/:id should call authMiddleware and obterAgendaPorId', async () => {
        authMiddleware.mockImplementation((req, res, next) => next());
        agendaController.obterAgendaPorId.mockImplementation((req, res) => res.status(200).json({}));

        await mockReq('get', '/api/agendas/1');

        expect(authMiddleware).toHaveBeenCalled();
        expect(agendaController.obterAgendaPorId).toHaveBeenCalled();
    });

    test('PUT /agendas/:id should call authMiddleware and atualizarAgenda', async () => {
        authMiddleware.mockImplementation((req, res, next) => next());
        agendaController.atualizarAgenda.mockImplementation((req, res) => res.status(200).json({}));

        await mockReq('put', '/api/agendas/1', { title: 'Updated Agenda' });

        expect(authMiddleware).toHaveBeenCalled();
        expect(agendaController.atualizarAgenda).toHaveBeenCalled();
    });

    test('DELETE /agendas/:id should call authMiddleware and deletarAgenda', async () => {
        authMiddleware.mockImplementation((req, res, next) => next());
        agendaController.deletarAgenda.mockImplementation((req, res) => res.status(204).send());

        await mockReq('delete', '/api/agendas/1');

        expect(authMiddleware).toHaveBeenCalled();
        expect(agendaController.deletarAgenda).toHaveBeenCalled();
    });
});