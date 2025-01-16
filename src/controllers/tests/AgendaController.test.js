const agendaController = require('../AgendaController');
const agendaService = require('../../services/AgendaService');

// FILE: AgendaController.test.js

jest.mock('../../services/AgendaService');

describe('AgendaController', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
  });

  describe('criarAgenda', () => {
    it('should create an agenda and return 201 status', async () => {
      const agenda = { id: 1, name: 'Test Agenda' };
      agendaService.createAgenda.mockResolvedValue(agenda);

      await agendaController.criarAgenda(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(agenda);
    });

    it('should return 500 status on error', async () => {
      const error = new Error('Error creating agenda');
      agendaService.createAgenda.mockRejectedValue(error);

      await agendaController.criarAgenda(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ mensagem: 'Erro ao criar a agenda', erro: error.message });
    });
  });

  describe('listarAgendas', () => {
    it('should list all agendas and return 200 status', async () => {
      const agendas = [{ id: 1, name: 'Test Agenda' }];
      agendaService.getAllAgendas.mockResolvedValue(agendas);

      await agendaController.listarAgendas(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(agendas);
    });

    it('should return 500 status on error', async () => {
      const error = new Error('Error listing agendas');
      agendaService.getAllAgendas.mockRejectedValue(error);

      await agendaController.listarAgendas(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ mensagem: 'Erro ao listar as agendas', erro: error.message });
    });
  });

  describe('obterAgendaPorId', () => {
    it('should get an agenda by id and return 200 status', async () => {
      const agenda = { id: 1, name: 'Test Agenda' };
      req.params.id = 1;
      agendaService.getAgendaById.mockResolvedValue(agenda);

      await agendaController.obterAgendaPorId(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(agenda);
    });

    it('should return 404 status if agenda not found', async () => {
      req.params.id = 1;
      agendaService.getAgendaById.mockResolvedValue(null);

      await agendaController.obterAgendaPorId(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ mensagem: 'Agenda não encontrada' });
    });

    it('should return 500 status on error', async () => {
      const error = new Error('Error getting agenda');
      req.params.id = 1;
      agendaService.getAgendaById.mockRejectedValue(error);

      await agendaController.obterAgendaPorId(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ mensagem: 'Erro ao obter a agenda', erro: error.message });
    });
  });

  describe('atualizarAgenda', () => {
    it('should update an agenda and return 200 status', async () => {
      const agenda = { id: 1, name: 'Updated Agenda' };
      req.params.id = 1;
      req.body = { name: 'Updated Agenda' };
      agendaService.updateAgenda.mockResolvedValue(agenda);

      await agendaController.atualizarAgenda(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(agenda);
    });

    it('should return 404 status if agenda not found', async () => {
      req.params.id = 1;
      req.body = { name: 'Updated Agenda' };
      agendaService.updateAgenda.mockResolvedValue(null);

      await agendaController.atualizarAgenda(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ mensagem: 'Agenda não encontrada' });
    });

    it('should return 500 status on error', async () => {
      const error = new Error('Error updating agenda');
      req.params.id = 1;
      req.body = { name: 'Updated Agenda' };
      agendaService.updateAgenda.mockRejectedValue(error);

      await agendaController.atualizarAgenda(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ mensagem: 'Erro ao atualizar a agenda', erro: error.message });
    });
  });

  describe('deletarAgenda', () => {
    it('should delete an agenda and return 204 status', async () => {
      req.params.id = 1;
      agendaService.deleteAgenda.mockResolvedValue(true);

      await agendaController.deletarAgenda(req, res);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('should return 404 status if agenda not found', async () => {
      req.params.id = 1;
      agendaService.deleteAgenda.mockResolvedValue(false);

      await agendaController.deletarAgenda(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ mensagem: 'Agenda não encontrada' });
    });

    it('should return 500 status on error', async () => {
      const error = new Error('Error deleting agenda');
      req.params.id = 1;
      agendaService.deleteAgenda.mockRejectedValue(error);

      await agendaController.deletarAgenda(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ mensagem: 'Erro ao deletar a agenda', erro: error.message });
    });
  });
});