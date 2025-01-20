const { Op, Sequelize } = require('sequelize');
const { Agenda } = require('../../../models');
const {
  buscarAgendasPorBarberEMes,
  calcularVariacaoAgendas,
  buscarServicoMaisEfetuado
} = require('../GraficosService');

jest.mock('../../../models', () => ({
  Agenda: {
    findAll: jest.fn(),
  }
}));

describe('GraficosService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('buscarAgendasPorBarberEMes', () => {
    // Testes já presentes
  });

  describe('calcularVariacaoAgendas', () => {
    it('should calculate agenda variation between months', async () => {
      const idBarber = 1;
      Agenda.findAll
        .mockResolvedValueOnce([{ id: 1 }, { id: 2 }]) // Agendas do mês atual
        .mockResolvedValueOnce([{ id: 3 }]); // Agendas do mês anterior

      const result = await calcularVariacaoAgendas(idBarber);

      expect(Agenda.findAll).toHaveBeenCalledTimes(2);
      expect(result).toBeCloseTo(100); // Variação de 1 para 2 agendas
    });

    it('should handle cases where no agendas exist for the previous month', async () => {
      const idBarber = 1;
      Agenda.findAll
        .mockResolvedValueOnce([{ id: 1 }]) // Agendas do mês atual
        .mockResolvedValueOnce([]); // Nenhuma agenda no mês anterior

      const result = await calcularVariacaoAgendas(idBarber);

      expect(result).toBe(100); // Crescimento 100%
    });
  });

  describe('buscarServicoMaisEfetuado', () => {
    it('should return the most performed service for a barber in a given month', async () => {
      const idBarber = 1;
      const mes = 5;
      Agenda.findAll.mockResolvedValue([
        { nomeServico: 'Corte' },
        { nomeServico: 'Corte' },
        { nomeServico: 'Barba' },
      ]);

      const result = await buscarServicoMaisEfetuado(idBarber, mes);

      expect(result).toBe('Corte');
    });
  });
});
