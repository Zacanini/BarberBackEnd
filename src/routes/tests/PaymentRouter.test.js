const request = require('supertest');
const express = require('express');
const router = require('../PaymentRouter');
const paymentController = require('../../controllers/PaymentController');
const authMiddleware = require('../../middlewares/authMiddleware');

// Mock do middleware e controller
jest.mock('../../middlewares/authMiddleware', () => jest.fn((req, res, next) => next()));
jest.mock('../../controllers/PaymentController');

const app = express();
app.use(express.json());
app.use(router);

describe('Rotas de Pagamentos', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // --- POST /payments ---
  describe('POST /payments', () => {
    it('deve chamar authMiddleware e criar pagamento', async () => {
      paymentController.criarPayment.mockImplementation((req, res) => res.sendStatus(201));
      
      await request(app)
        .post('/payments')
        .send({ amount: 100 });

      expect(authMiddleware).toHaveBeenCalled();
      expect(paymentController.criarPayment).toHaveBeenCalled();
    });

    it('deve retornar 401 se authMiddleware falhar', async () => {
      authMiddleware.mockImplementationOnce((req, res, next) => res.status(401).send());
      
      const response = await request(app)
        .post('/payments')
        .send({ amount: 100 });

      expect(response.status).toBe(401);
    });
  });

  // --- GET /payments ---
  describe('GET /payments', () => {
    it('deve chamar authMiddleware e listar pagamentos', async () => {
      paymentController.listarPayments.mockImplementation((req, res) => res.sendStatus(200));
      
      await request(app).get('/payments');
      
      expect(authMiddleware).toHaveBeenCalled();
      expect(paymentController.listarPayments).toHaveBeenCalled();
    });
  });

  // --- GET /payments/:id ---
  describe('GET /payments/:id', () => {
    it('deve chamar authMiddleware e buscar por ID', async () => {
      paymentController.obterPaymentPorId.mockImplementation((req, res) => res.sendStatus(200));
      
      await request(app).get('/payments/123');
      
      expect(authMiddleware).toHaveBeenCalled();
      expect(paymentController.obterPaymentPorId).toHaveBeenCalled();
    });
  });

  // --- PUT /payments/:id ---
  describe('PUT /payments/:id', () => {
    it('deve chamar authMiddleware e atualizar pagamento', async () => {
      paymentController.atualizarPayment.mockImplementation((req, res) => res.sendStatus(200));
      
      await request(app)
        .put('/payments/123')
        .send({ amount: 200 });

      expect(authMiddleware).toHaveBeenCalled();
      expect(paymentController.atualizarPayment).toHaveBeenCalled();
    });
  });

  // --- DELETE /payments/:id ---
  describe('DELETE /payments/:id', () => {
    it('deve chamar authMiddleware e deletar pagamento', async () => {
      paymentController.deletarPayment.mockImplementation((req, res) => res.sendStatus(204));
      
      await request(app).delete('/payments/123');
      
      expect(authMiddleware).toHaveBeenCalled();
      expect(paymentController.deletarPayment).toHaveBeenCalled();
    });
  });

  // --- TESTE DE ROTA NÃO AUTORIZADA ---
  describe('Acesso não autorizado', () => {
    it('deve bloquear acesso sem autenticação', async () => {
      jest.setTimeout(15000); // Aumenta o timeout
      
      // Mock para todas as requisições
      authMiddleware.mockImplementation((req, res, next) => 
        res.status(401).json({ message: 'Não autorizado' })
      );
  
      // Executa todas as requisições em paralelo
      const responses = await Promise.all([
        request(app).post('/payments'),
        request(app).get('/payments'),
        request(app).get('/payments/1'),
        request(app).put('/payments/1'),
        request(app).delete('/payments/1')
      ]);
  
      // Verifica todas as respostas
      for (const response of responses) {
        expect(response.status).toBe(401);
      }
    }, 15000); // Timeout de 15s
  });
});