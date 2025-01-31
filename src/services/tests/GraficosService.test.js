const { Op, Sequelize } = require('sequelize');
const { Agenda, Barber } = require('../../../models');
const {
  buscarAgendasPorBarberEMes,
  calcularVariacaoAgendas,
  buscarServicoMaisEfetuado,
  compararServicosBarbeiros,
  buscarServicoMaisVendidoPorShop
} = require('../GraficosService');

jest.mock('../../../models', () => ({
  Agenda: {
    findAll: jest.fn(),
    findOne: jest.fn()
  },
  Barber: {
    findAll: jest.fn()
  }
}));

describe('GraficosService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('calcularVariacaoAgendas', () => {
    it('should calculate agenda variation correctly', async () => {
      const idBarber = 1;
      Agenda.findAll
        .mockResolvedValueOnce([{ id: 1 }, { id: 2 }])
        .mockResolvedValueOnce([{ id: 3 }]);

      const result = await calcularVariacaoAgendas(idBarber);
      expect(result).toBeCloseTo(100);
    });
  });

  describe('buscarServicoMaisEfetuado', () => {
    it('should return the most performed service', async () => {
      const idBarber = 1;
      const mes = 5;
      Agenda.findOne.mockResolvedValue({ nomeServico: 'Corte' });

      const result = await buscarServicoMaisEfetuado(idBarber, mes);
      expect(result).toBe('Corte');
    });
  });

  describe('compararServicosBarbeiros', () => {
    it('should return the service comparison for barbers in a shop', async () => {
      const idShop = 1;
      const mes = 5;
      Barber.findAll.mockResolvedValue([
        { id: 1, nome: 'João', totalAgendas: 10 },
        { id: 2, nome: 'Carlos', totalAgendas: 5 }
      ]);

      const result = await compararServicosBarbeiros(idShop, mes);
      expect(result).toEqual({ João: 10, Carlos: 5 });
    });
  });

  describe('buscarServicoMaisVendidoPorShop', () => {
    it('should return the most sold service in a shop', async () => {
      const idShop = 1;
      Agenda.findOne.mockResolvedValue({ nomeServico: 'Barba' });

      const result = await buscarServicoMaisVendidoPorShop(idShop);
      expect(result).toBe('Barba');
    });
  });
});
