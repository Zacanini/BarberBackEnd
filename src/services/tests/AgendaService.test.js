const { Agenda } = require('../../../models');

// filepath: /D:/BarbersBr/BarberBackEnd/src/services/AgendaService.test.js
const {
  createAgenda,
  getAllAgendas,
  getAgendaById,
  updateAgenda,
  deleteAgenda
} = require('../AgendaService');

jest.mock('../../../models', () => ({
  Agenda: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
  }
}));

describe('AgendaService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createAgenda', () => {
    it('should create a new agenda', async () => {
      const data = { name: 'Test Agenda' };
      const createdAgenda = { id: 1, ...data };
      Agenda.create.mockResolvedValue(createdAgenda);

      const result = await createAgenda(data);

      expect(Agenda.create).toHaveBeenCalledWith(data);
      expect(result).toBe(createdAgenda);
    });
  });

  describe('getAllAgendas', () => {
    it('should return all agendas', async () => {
      const agendas = [{ id: 1, name: 'Test Agenda' }];
      Agenda.findAll.mockResolvedValue(agendas);

      const result = await getAllAgendas();

      expect(Agenda.findAll).toHaveBeenCalled();
      expect(result).toBe(agendas);
    });
  });

  describe('getAgendaById', () => {
    it('should return the agenda by id', async () => {
      const agenda = { id: 1, name: 'Test Agenda' };
      Agenda.findByPk.mockResolvedValue(agenda);

      const result = await getAgendaById(1);

      expect(Agenda.findByPk).toHaveBeenCalledWith(1);
      expect(result).toBe(agenda);
    });

    it('should return null if agenda not found', async () => {
      Agenda.findByPk.mockResolvedValue(null);

      const result = await getAgendaById(1);

      expect(Agenda.findByPk).toHaveBeenCalledWith(1);
      expect(result).toBeNull();
    });
  });

  describe('updateAgenda', () => {
    it('should update the agenda if found', async () => {
      const agenda = { id: 1, name: 'Test Agenda', update: jest.fn().mockResolvedValue(true) };
      const data = { name: 'Updated Agenda' };
      Agenda.findByPk.mockResolvedValue(agenda);

      const result = await updateAgenda(1, data);

      expect(Agenda.findByPk).toHaveBeenCalledWith(1);
      expect(agenda.update).toHaveBeenCalledWith(data);
      expect(result).toBe(true);
    });

    it('should return null if agenda not found', async () => {
      Agenda.findByPk.mockResolvedValue(null);

      const result = await updateAgenda(1, { name: 'Updated Agenda' });

      expect(Agenda.findByPk).toHaveBeenCalledWith(1);
      expect(result).toBeNull();
    });
  });

  describe('deleteAgenda', () => {
    it('should delete the agenda if found', async () => {
      const agenda = { id: 1, name: 'Test Agenda', destroy: jest.fn().mockResolvedValue(true) };
      Agenda.findByPk.mockResolvedValue(agenda);

      const result = await deleteAgenda(1);

      expect(Agenda.findByPk).toHaveBeenCalledWith(1);
      expect(agenda.destroy).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false if agenda not found', async () => {
      Agenda.findByPk.mockResolvedValue(null);

      const result = await deleteAgenda(1);

      expect(Agenda.findByPk).toHaveBeenCalledWith(1);
      expect(result).toBe(false);
    });
  });
});