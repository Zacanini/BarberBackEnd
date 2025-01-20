const barberController = require('../BarberController');
const barberService = require('../../services/BarberService');

jest.mock('../../services/BarberService');

describe('BarberController', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
  });

  describe('criarBarber', () => {
    it('deve criar um barbeiro e retornar status 201', async () => {
      const barber = { id: 1, nome: 'Barbeiro Teste', whatsapp: '1234567890' };
      barberService.createBarber.mockResolvedValue(barber);

      await barberController.criarBarber(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(barber);
    });

    it('deve retornar status 500 em caso de erro', async () => {
      const error = new Error('Erro ao criar barbeiro');
      barberService.createBarber.mockRejectedValue(error);

      await barberController.criarBarber(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ mensagem: 'Erro ao criar o barbeiro', erro: error.message });
    });
  });

  describe('listarBarbers', () => {
    it('deve listar todos os barbeiros e retornar status 200', async () => {
      const barbers = [{ id: 1, nome: 'Barbeiro Teste', whatsapp: '1234567890' }];
      barberService.getAllBarbers.mockResolvedValue(barbers);

      await barberController.listarBarbers(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(barbers);
    });

    it('deve retornar status 500 em caso de erro', async () => {
      const error = new Error('Erro ao listar barbeiros');
      barberService.getAllBarbers.mockRejectedValue(error);

      await barberController.listarBarbers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ mensagem: 'Erro ao listar os barbeiros', erro: error.message });
    });
  });

  describe('obterBarberPorId', () => {
    it('deve obter um barbeiro por id e retornar status 200', async () => {
      const barber = { id: 1, nome: 'Barbeiro Teste', whatsapp: '1234567890' };
      req.params.id = 1;
      barberService.getBarberById.mockResolvedValue(barber);

      await barberController.obterBarberPorId(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(barber);
    });

    it('deve retornar status 404 se barbeiro não for encontrado', async () => {
      req.params.id = 1;
      barberService.getBarberById.mockResolvedValue(null);

      await barberController.obterBarberPorId(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ mensagem: 'Barbeiro não encontrado' });
    });

    it('deve retornar status 500 em caso de erro', async () => {
      const error = new Error('Erro ao obter barbeiro');
      req.params.id = 1;
      barberService.getBarberById.mockRejectedValue(error);

      await barberController.obterBarberPorId(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ mensagem: 'Erro ao obter o barbeiro', erro: error.message });
    });
  });

  describe('atualizarBarber', () => {
    it('deve atualizar um barbeiro e retornar status 200', async () => {
      const barber = { id: 1, nome: 'Barbeiro Atualizado', whatsapp: '0987654321' };
      req.params.id = 1;
      req.body = { nome: 'Barbeiro Atualizado', whatsapp: '0987654321' };
      barberService.updateBarber.mockResolvedValue(barber);

      await barberController.atualizarBarber(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(barber);
    });

    it('deve retornar status 404 se barbeiro não for encontrado', async () => {
      req.params.id = 1;
      req.body = { nome: 'Barbeiro Atualizado' };
      barberService.updateBarber.mockResolvedValue(null);

      await barberController.atualizarBarber(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ mensagem: 'Barbeiro não encontrado' });
    });

    it('deve retornar status 500 em caso de erro', async () => {
      const error = new Error('Erro ao atualizar barbeiro');
      req.params.id = 1;
      req.body = { nome: 'Barbeiro Atualizado' };
      barberService.updateBarber.mockRejectedValue(error);

      await barberController.atualizarBarber(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ mensagem: 'Erro ao atualizar o barbeiro', erro: error.message });
    });
  });

  describe('deletarBarber', () => {
    it('deve deletar um barbeiro e retornar status 204', async () => {
      req.params.id = 1;
      barberService.deleteBarber.mockResolvedValue(true);

      await barberController.deletarBarber(req, res);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('deve retornar status 404 se barbeiro não for encontrado', async () => {
      req.params.id = 1;
      barberService.deleteBarber.mockResolvedValue(false);

      await barberController.deletarBarber(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ mensagem: 'Barbeiro não encontrado' });
    });

    it('deve retornar status 500 em caso de erro', async () => {
      const error = new Error('Erro ao deletar barbeiro');
      req.params.id = 1;
      barberService.deleteBarber.mockRejectedValue(error);

      await barberController.deletarBarber(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ mensagem: 'Erro ao deletar o barbeiro', erro: error.message });
    });
  });
});