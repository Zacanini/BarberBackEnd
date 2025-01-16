// ServicoController.test.js
const {
    criarServico,
    listarServicos,
    obterServicoPorId,
    atualizarServico,
    deletarServico,
  } = require('../ServicoController');
  
  jest.mock('../../services/ServicoService', () => ({
    createServico: jest.fn(),
    getAllServicos: jest.fn(),
    getServicoById: jest.fn(),
    updateServico: jest.fn(),
    deleteServico: jest.fn(),
  }));
  
  const servicoService = require('../../services/ServicoService');
  
  describe('ServicoController', () => {
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
  
    test('criarServico - should create a service and return it', async () => {
      const req = mockReq({}, { nome: 'Corte de Cabelo', preco: 50 });
      const res = mockRes();
      const mockData = { id: 1, nome: 'Corte de Cabelo', preco: 50 };
  
      servicoService.createServico.mockResolvedValue(mockData);
  
      await criarServico(req, res);
  
      expect(servicoService.createServico).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockData);
    });
  
    test('listarServicos - should return all services', async () => {
      const req = mockReq();
      const res = mockRes();
      const mockData = [{ id: 1, nome: 'Corte de Cabelo', preco: 50 }];
  
      servicoService.getAllServicos.mockResolvedValue(mockData);
  
      await listarServicos(req, res);
  
      expect(servicoService.getAllServicos).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockData);
    });
  
    test('obterServicoPorId - should return a service by ID', async () => {
      const req = mockReq({ id: '1' });
      const res = mockRes();
      const mockData = { id: 1, nome: 'Corte de Cabelo', preco: 50 };
  
      servicoService.getServicoById.mockResolvedValue(mockData);
  
      await obterServicoPorId(req, res);
  
      expect(servicoService.getServicoById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockData);
    });
  
    test('obterServicoPorId - should return 404 if service not found', async () => {
      const req = mockReq({ id: '1' });
      const res = mockRes();
  
      servicoService.getServicoById.mockResolvedValue(null);
  
      await obterServicoPorId(req, res);
  
      expect(servicoService.getServicoById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ mensagem: 'Serviço não encontrado' });
    });
  
    test('atualizarServico - should update a service and return it', async () => {
      const req = mockReq({ id: '1' }, { nome: 'Barba', preco: 30 });
      const res = mockRes();
      const mockData = { id: 1, nome: 'Barba', preco: 30 };
  
      servicoService.updateServico.mockResolvedValue(mockData);
  
      await atualizarServico(req, res);
  
      expect(servicoService.updateServico).toHaveBeenCalledWith('1', req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockData);
    });
  
    test('atualizarServico - should return 404 if service not found', async () => {
      const req = mockReq({ id: '1' }, { nome: 'Barba', preco: 30 });
      const res = mockRes();
  
      servicoService.updateServico.mockResolvedValue(null);
  
      await atualizarServico(req, res);
  
      expect(servicoService.updateServico).toHaveBeenCalledWith('1', req.body);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ mensagem: 'Serviço não encontrado' });
    });
  
    test('deletarServico - should delete a service', async () => {
      const req = mockReq({ id: '1' });
      const res = mockRes();
  
      servicoService.deleteServico.mockResolvedValue(true);
  
      await deletarServico(req, res);
  
      expect(servicoService.deleteServico).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });
  
    test('deletarServico - should return 404 if service not found', async () => {
      const req = mockReq({ id: '1' });
      const res = mockRes();
  
      servicoService.deleteServico.mockResolvedValue(false);
  
      await deletarServico(req, res);
  
      expect(servicoService.deleteServico).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ mensagem: 'Serviço não encontrado' });
    });
  
    test('should handle errors in criarServico', async () => {
      const req = mockReq({}, { nome: 'Corte de Cabelo', preco: 50 });
      const res = mockRes();
      const mockError = new Error('Erro ao criar o serviço');
  
      servicoService.createServico.mockRejectedValue(mockError);
  
      await criarServico(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ mensagem: 'Erro ao criar o serviço', erro: mockError.message });
    });
  
    // Similar error handling tests can be added for other functions if needed.
  });
  