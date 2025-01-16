// ShopController.test.js
const {
    criarShop,
    listarShops,
    obterShopPorId,
    atualizarShop,
    deletarShop,
  } = require('../ShopController');
  
  jest.mock('../../services/ShopService', () => ({
    createShop: jest.fn(),
    getAllShops: jest.fn(),
    getShopById: jest.fn(),
    updateShop: jest.fn(),
    deleteShop: jest.fn(),
  }));
  
  const shopService = require('../../services/ShopService');
  
  describe('ShopController', () => {
    const mockRes = () => {
      const res = {};
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn();
      res.send = jest.fn();
      return res;
    };
  
    const mockReq = (params = {}, body = {}) => ({ params, body });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    test('criarShop - should create a shop and return it', async () => {
      const req = mockReq({}, { nome: 'Barbearia Elite', endereco: 'Rua A, 123' });
      const res = mockRes();
      const mockData = { id: 1, nome: 'Barbearia Elite', endereco: 'Rua A, 123' };
  
      shopService.createShop.mockResolvedValue(mockData);
  
      await criarShop(req, res);
  
      expect(shopService.createShop).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockData);
    });
  
    test('listarShops - should return all shops', async () => {
      const req = mockReq();
      const res = mockRes();
      const mockData = [{ id: 1, nome: 'Barbearia Elite', endereco: 'Rua A, 123' }];
  
      shopService.getAllShops.mockResolvedValue(mockData);
  
      await listarShops(req, res);
  
      expect(shopService.getAllShops).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockData);
    });
  
    test('obterShopPorId - should return a shop by ID', async () => {
      const req = mockReq({ id: '1' });
      const res = mockRes();
      const mockData = { id: 1, nome: 'Barbearia Elite', endereco: 'Rua A, 123' };
  
      shopService.getShopById.mockResolvedValue(mockData);
  
      await obterShopPorId(req, res);
  
      expect(shopService.getShopById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockData);
    });
  
    test('obterShopPorId - should return 404 if shop not found', async () => {
      const req = mockReq({ id: '1' });
      const res = mockRes();
  
      shopService.getShopById.mockResolvedValue(null);
  
      await obterShopPorId(req, res);
  
      expect(shopService.getShopById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ mensagem: 'Barbearia não encontrada' });
    });
  
    test('atualizarShop - should update a shop and return it', async () => {
      const req = mockReq({ id: '1' }, { nome: 'Barbearia Nova', endereco: 'Rua B, 456' });
      const res = mockRes();
      const mockData = { id: 1, nome: 'Barbearia Nova', endereco: 'Rua B, 456' };
  
      shopService.updateShop.mockResolvedValue(mockData);
  
      await atualizarShop(req, res);
  
      expect(shopService.updateShop).toHaveBeenCalledWith('1', req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockData);
    });
  
    test('atualizarShop - should return 404 if shop not found', async () => {
      const req = mockReq({ id: '1' }, { nome: 'Barbearia Nova', endereco: 'Rua B, 456' });
      const res = mockRes();
  
      shopService.updateShop.mockResolvedValue(null);
  
      await atualizarShop(req, res);
  
      expect(shopService.updateShop).toHaveBeenCalledWith('1', req.body);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ mensagem: 'Barbearia não encontrada' });
    });
  
    test('deletarShop - should delete a shop', async () => {
      const req = mockReq({ id: '1' });
      const res = mockRes();
  
      shopService.deleteShop.mockResolvedValue(true);
  
      await deletarShop(req, res);
  
      expect(shopService.deleteShop).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });
  
    test('deletarShop - should return 404 if shop not found', async () => {
      const req = mockReq({ id: '1' });
      const res = mockRes();
  
      shopService.deleteShop.mockResolvedValue(false);
  
      await deletarShop(req, res);
  
      expect(shopService.deleteShop).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ mensagem: 'Barbearia não encontrada' });
    });
  
    test('should handle errors in criarShop', async () => {
      const req = mockReq({}, { nome: 'Barbearia Elite', endereco: 'Rua A, 123' });
      const res = mockRes();
      const mockError = new Error('Erro ao criar a barbearia');
  
      shopService.createShop.mockRejectedValue(mockError);
  
      await criarShop(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ mensagem: 'Erro ao criar a barbearia', erro: mockError.message });
    });
  
    // Similar error handling tests can be added for other functions if needed.
  });
  