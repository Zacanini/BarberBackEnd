const {
    criarUser,
    listarUsers,
    obterUserPorId,
    atualizarUser,
    deletarUser,
  } = require('../UserController');
  
  jest.mock('../../services/UserService', () => ({
    createUser: jest.fn(),
    getAllUsers: jest.fn(),
    getUserById: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  }));
  
  const userService = require('../../services/UserService');
  
  describe('UserController', () => {
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
  
    test('criarUser - should create a user and return it', async () => {
      const req = mockReq({}, { nome: 'João', email: 'joao@example.com', whatsapp: '1234567890' });
      const res = mockRes();
      const mockData = { id: 1, nome: 'João', email: 'joao@example.com', whatsapp: '1234567890' };
  
      userService.createUser.mockResolvedValue(mockData);
  
      await criarUser(req, res);
  
      expect(userService.createUser).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockData);
    });
  
    test('listarUsers - should return all users', async () => {
      const req = mockReq();
      const res = mockRes();
      const mockData = [{ id: 1, nome: 'João', email: 'joao@example.com', whatsapp: '1234567890' }];
  
      userService.getAllUsers.mockResolvedValue(mockData);
  
      await listarUsers(req, res);
  
      expect(userService.getAllUsers).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockData);
    });
  
    test('obterUserPorId - should return a user by ID', async () => {
      const req = mockReq({ id: '1' });
      const res = mockRes();
      const mockData = { id: 1, nome: 'João', email: 'joao@example.com', whatsapp: '1234567890' };
  
      userService.getUserById.mockResolvedValue(mockData);
  
      await obterUserPorId(req, res);
  
      expect(userService.getUserById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockData);
    });
  
    test('obterUserPorId - should return 404 if user not found', async () => {
      const req = mockReq({ id: '1' });
      const res = mockRes();
  
      userService.getUserById.mockResolvedValue(null);
  
      await obterUserPorId(req, res);
  
      expect(userService.getUserById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ mensagem: 'Usuário não encontrado' });
    });
  
    test('atualizarUser - should update a user and return it', async () => {
      const req = mockReq({ id: '1' }, { nome: 'Carlos', email: 'carlos@example.com', whatsapp: '0987654321' });
      const res = mockRes();
      const mockData = { id: 1, nome: 'Carlos', email: 'carlos@example.com', whatsapp: '0987654321' };
  
      userService.updateUser.mockResolvedValue(mockData);
  
      await atualizarUser(req, res);
  
      expect(userService.updateUser).toHaveBeenCalledWith('1', req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockData);
    });
  
    test('atualizarUser - should return 404 if user not found', async () => {
      const req = mockReq({ id: '1' }, { nome: 'Carlos', email: 'carlos@example.com' });
      const res = mockRes();
  
      userService.updateUser.mockResolvedValue(null);
  
      await atualizarUser(req, res);
  
      expect(userService.updateUser).toHaveBeenCalledWith('1', req.body);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ mensagem: 'Usuário não encontrado' });
    });
  
    test('deletarUser - should delete a user', async () => {
      const req = mockReq({ id: '1' });
      const res = mockRes();
  
      userService.deleteUser.mockResolvedValue(true);
  
      await deletarUser(req, res);
  
      expect(userService.deleteUser).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });
  
    test('deletarUser - should return 404 if user not found', async () => {
      const req = mockReq({ id: '1' });
      const res = mockRes();
  
      userService.deleteUser.mockResolvedValue(false);
  
      await deletarUser(req, res);
  
      expect(userService.deleteUser).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ mensagem: 'Usuário não encontrado' });
    });
  
    test('should handle errors in criarUser', async () => {
      const req = mockReq({}, { nome: 'João', email: 'joao@example.com' });
      const res = mockRes();
      const mockError = new Error('Erro ao criar o usuário');
  
      userService.createUser.mockRejectedValue(mockError);
  
      await criarUser(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ mensagem: 'Erro ao criar o usuário', erro: mockError.message });
    });
  
    // Similar error handling tests can be added for other functions if needed.
  });