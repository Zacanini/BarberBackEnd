const { Payment } = require('../../../models');
const {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment
} = require('../PaymentService');

// Mock do modelo Payment
jest.mock('../../../models', () => ({
  Payment: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
  }
}));

describe('PaymentService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // --- CREATE PAYMENT ---
  describe('createPayment', () => {
    it('deve criar um novo pagamento', async () => {
      const data = { amount: 100, status: 'pending' };
      const createdPayment = { id: 1, ...data };
      Payment.create.mockResolvedValue(createdPayment);

      const result = await createPayment(data);

      expect(Payment.create).toHaveBeenCalledWith(data);
      expect(result).toEqual(createdPayment);
    });

    it('deve lançar um erro se houver falha no banco de dados', async () => {
      const errorMessage = 'Erro no banco de dados';
      Payment.create.mockRejectedValue(new Error(errorMessage));

      await expect(createPayment({})).rejects.toThrow(errorMessage);
    });
  });

  // --- GET ALL PAYMENTS ---
  describe('getAllPayments', () => {
    it('deve retornar todos os pagamentos', async () => {
      const payments = [{ id: 1, amount: 100, status: 'paid' }];
      Payment.findAll.mockResolvedValue(payments);

      const result = await getAllPayments();

      expect(Payment.findAll).toHaveBeenCalled();
      expect(result).toEqual(payments);
    });

    it('deve retornar um array vazio se não houver pagamentos', async () => {
      Payment.findAll.mockResolvedValue([]);

      const result = await getAllPayments();

      expect(result).toEqual([]);
    });

    it('deve lançar um erro em caso de falha no banco de dados', async () => {
      const errorMessage = 'Erro no banco de dados';
      Payment.findAll.mockRejectedValue(new Error(errorMessage));

      await expect(getAllPayments()).rejects.toThrow(errorMessage);
    });
  });

  // --- GET PAYMENT BY ID ---
  describe('getPaymentById', () => {
    it('deve retornar o pagamento pelo ID', async () => {
      const payment = { id: 1, amount: 100, status: 'paid' };
      Payment.findByPk.mockResolvedValue(payment);

      const result = await getPaymentById(1);

      expect(Payment.findByPk).toHaveBeenCalledWith(1);
      expect(result).toEqual(payment);
    });

    it('deve retornar null se o pagamento não existir', async () => {
      Payment.findByPk.mockResolvedValue(null);

      const result = await getPaymentById(999);

      expect(result).toBeNull();
    });

    it('deve lançar um erro em caso de falha no banco de dados', async () => {
      const errorMessage = 'Erro no banco de dados';
      Payment.findByPk.mockRejectedValue(new Error(errorMessage));

      await expect(getPaymentById(1)).rejects.toThrow(errorMessage);
    });
  });

  // --- UPDATE PAYMENT ---
  describe('updatePayment', () => {
    it('deve atualizar um pagamento existente', async () => {
      const payment = { 
        id: 1, 
        amount: 100, 
        update: jest.fn().mockResolvedValue({ id: 1, amount: 200 }) 
      };
      Payment.findByPk.mockResolvedValue(payment);

      const result = await updatePayment(1, { amount: 200 });

      expect(Payment.findByPk).toHaveBeenCalledWith(1);
      expect(payment.update).toHaveBeenCalledWith({ amount: 200 });
      expect(result).toEqual({ id: 1, amount: 200 });
    });

    it('deve retornar null se o pagamento não existir', async () => {
      Payment.findByPk.mockResolvedValue(null);

      const result = await updatePayment(999, { amount: 200 });

      expect(result).toBeNull();
    });

    it('deve lançar um erro em caso de falha no banco de dados', async () => {
      const errorMessage = 'Erro no banco de dados';
      Payment.findByPk.mockRejectedValue(new Error(errorMessage));

      await expect(updatePayment(1, {})).rejects.toThrow(errorMessage);
    });
  });

  // --- DELETE PAYMENT ---
  describe('deletePayment', () => {
    it('deve deletar um pagamento existente', async () => {
      const payment = { 
        id: 1, 
        destroy: jest.fn().mockResolvedValue(true) 
      };
      Payment.findByPk.mockResolvedValue(payment);

      const result = await deletePayment(1);

      expect(Payment.findByPk).toHaveBeenCalledWith(1);
      expect(payment.destroy).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('deve retornar false se o pagamento não existir', async () => {
      Payment.findByPk.mockResolvedValue(null);

      const result = await deletePayment(999);

      expect(result).toBe(false);
    });

    it('deve lançar um erro em caso de falha no banco de dados', async () => {
      const errorMessage = 'Erro no banco de dados';
      Payment.findByPk.mockRejectedValue(new Error(errorMessage));

      await expect(deletePayment(1)).rejects.toThrow(errorMessage);
    });
  });
});