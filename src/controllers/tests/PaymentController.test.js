const request = require('supertest');
const express = require('express');
const paymentController = require('../PaymentController');
const paymentService = require('../../services/PaymentService');

jest.mock('../../services/PaymentService');

const app = express();
app.use(express.json());
app.post('/payments', paymentController.criarPayment);
app.get('/payments', paymentController.listarPayments);
app.get('/payments/:id', paymentController.obterPaymentPorId);
app.put('/payments/:id', paymentController.atualizarPayment);
app.delete('/payments/:id', paymentController.deletarPayment);

describe('PaymentController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // --- CRIAR PAGAMENTO ---
  describe('POST /payments', () => {
    it('deve criar um pagamento com status 201', async () => {
      const mockPayment = { id: 1, amount: 100 };
      paymentService.createPayment.mockResolvedValue(mockPayment);

      const response = await request(app)
        .post('/payments')
        .send({ amount: 100 });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockPayment);
      expect(paymentService.createPayment).toHaveBeenCalledWith({ amount: 100 });
    });

    it('deve retornar erro 500 em caso de falha', async () => {
      paymentService.createPayment.mockRejectedValue(new Error('Erro no banco'));

      const response = await request(app)
        .post('/payments')
        .send({ amount: 100 });

      expect(response.status).toBe(500);
      expect(response.body).toMatchObject({
        mensagem: 'Erro ao criar o pagamento'
      });
    });
  });

  // --- LISTAR PAGAMENTOS ---
  describe('GET /payments', () => {
    it('deve retornar todos pagamentos com status 200', async () => {
      const mockPayments = [{ id: 1 }, { id: 2 }];
      paymentService.getAllPayments.mockResolvedValue(mockPayments);

      const response = await request(app).get('/payments');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPayments);
    });

    it('deve retornar erro 500 em caso de falha', async () => {
      paymentService.getAllPayments.mockRejectedValue(new Error('Erro no banco'));

      const response = await request(app).get('/payments');
      
      expect(response.status).toBe(500);
      expect(response.body).toMatchObject({
        mensagem: 'Erro ao listar os pagamentos'
      });
    });
  });

  // --- OBTER PAGAMENTO POR ID ---
  describe('GET /payments/:id', () => {
    it('deve retornar o pagamento com status 200', async () => {
      const mockPayment = { id: 1, amount: 100 };
      paymentService.getPaymentById.mockResolvedValue(mockPayment);

      const response = await request(app).get('/payments/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPayment);
      expect(paymentService.getPaymentById).toHaveBeenCalledWith('1');
    });

    it('deve retornar 404 se pagamento não existir', async () => {
      paymentService.getPaymentById.mockResolvedValue(null);

      const response = await request(app).get('/payments/999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ mensagem: 'Pagamento não encontrado' });
    });

    it('deve retornar erro 500 em caso de falha', async () => {
      paymentService.getPaymentById.mockRejectedValue(new Error('Erro no banco'));

      const response = await request(app).get('/payments/1');

      expect(response.status).toBe(500);
      expect(response.body).toMatchObject({
        mensagem: 'Erro ao obter o pagamento'
      });
    });
  });

  // --- ATUALIZAR PAGAMENTO ---
  describe('PUT /payments/:id', () => {
    it('deve atualizar pagamento com status 200', async () => {
      const mockUpdated = { id: 1, amount: 200 };
      paymentService.updatePayment.mockResolvedValue(mockUpdated);

      const response = await request(app)
        .put('/payments/1')
        .send({ amount: 200 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUpdated);
      expect(paymentService.updatePayment).toHaveBeenCalledWith('1', { amount: 200 });
    });

    it('deve retornar 404 se pagamento não existir', async () => {
      paymentService.updatePayment.mockResolvedValue(null);

      const response = await request(app)
        .put('/payments/999')
        .send({ amount: 200 });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ mensagem: 'Pagamento não encontrado' });
    });

    it('deve retornar erro 500 em caso de falha', async () => {
      paymentService.updatePayment.mockRejectedValue(new Error('Erro no banco'));

      const response = await request(app)
        .put('/payments/1')
        .send({ amount: 200 });

      expect(response.status).toBe(500);
      expect(response.body).toMatchObject({
        mensagem: 'Erro ao atualizar o pagamento'
      });
    });
  });

  // --- DELETAR PAGAMENTO ---
  describe('DELETE /payments/:id', () => {
    it('deve deletar pagamento com status 204', async () => {
      paymentService.deletePayment.mockResolvedValue(true);

      const response = await request(app).delete('/payments/1');

      expect(response.status).toBe(204);
      expect(paymentService.deletePayment).toHaveBeenCalledWith('1');
    });

    it('deve retornar 404 se pagamento não existir', async () => {
      paymentService.deletePayment.mockResolvedValue(false);

      const response = await request(app).delete('/payments/999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ mensagem: 'Pagamento não encontrado' });
    });

    it('deve retornar erro 500 em caso de falha', async () => {
      paymentService.deletePayment.mockRejectedValue(new Error('Erro no banco'));

      const response = await request(app).delete('/payments/1');

      expect(response.status).toBe(500);
      expect(response.body).toMatchObject({
        mensagem: 'Erro ao deletar o pagamento'
      });
    });
  });
});