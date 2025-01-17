const request = require('supertest');
const express = require('express');
const router = require('../GraficoRouter');
const graficosController = require('../../controllers/GraficosController');

// FILE: src/routes/GraficoRouter.test.js


jest.mock('../../controllers/GraficosController');

const app = express();
app.use(express.json());
app.use('/api', router);

describe('GraficoRouter', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('GET /agendas/barber/:id/:mes should call getAgendasPorBarberEMes', async () => {
        graficosController.getAgendasPorBarberEMes.mockImplementation((req, res) => res.status(200).send());

        await request(app).get('/api/agendas/barber/1/2023-10');

        expect(graficosController.getAgendasPorBarberEMes).toHaveBeenCalled();
    });

    test('GET /comparar/agendas/:id should call compararAgendasMeses', async () => {
        graficosController.compararAgendasMeses.mockImplementation((req, res) => res.status(200).send());

        await request(app).get('/api/comparar/agendas/1');

        expect(graficosController.compararAgendasMeses).toHaveBeenCalled();
    });

    test('GET /servico/mais-efetuado/:id/:mes should call getServicoMaisEfetuado', async () => {
        graficosController.getServicoMaisEfetuado.mockImplementation((req, res) => res.status(200).send());

        await request(app).get('/api/servico/mais-efetuado/1/2023-10');

        expect(graficosController.getServicoMaisEfetuado).toHaveBeenCalled();
    });

    test('GET /agendas/shop/:id/:mes should call getAgendasPorShopEMes', async () => {
        graficosController.getAgendasPorShopEMes.mockImplementation((req, res) => res.status(200).send());

        await request(app).get('/api/agendas/shop/1/2023-10');

        expect(graficosController.getAgendasPorShopEMes).toHaveBeenCalled();
    });

    test('GET /comparar/servicos/:id/:mes should call compararServicosBarbeiros', async () => {
        graficosController.compararServicosBarbeiros.mockImplementation((req, res) => res.status(200).send());

        await request(app).get('/api/comparar/servicos/1/2023-10');

        expect(graficosController.compararServicosBarbeiros).toHaveBeenCalled();
    });

    test('GET /servico/mais-vendido/:id should call getServicoMaisVendidoPorShop', async () => {
        graficosController.getServicoMaisVendidoPorShop.mockImplementation((req, res) => res.status(200).send());

        await request(app).get('/api/servico/mais-vendido/1');

        expect(graficosController.getServicoMaisVendidoPorShop).toHaveBeenCalled();
    });

    test('GET /servicos/marcados/:id should call getServicosMarcadosPorUsuario', async () => {
        graficosController.getServicosMarcadosPorUsuario.mockImplementation((req, res) => res.status(200).send());

        await request(app).get('/api/servicos/marcados/1');

        expect(graficosController.getServicosMarcadosPorUsuario).toHaveBeenCalled();
    });
});