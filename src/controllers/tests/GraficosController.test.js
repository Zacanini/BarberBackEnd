// GraficosController.test.js
const {
    getAgendasPorBarberEMes,
    compararAgendasMeses,
    getServicoMaisEfetuado,
    getAgendasPorShopEMes,
    compararServicosBarbeiros,
    getServicoMaisVendidoPorShop,
    getServicosMarcadosPorUsuario,
  } = require('../GraficosController');
  
  jest.mock('../../services/GraficosService', () => ({
    GraficosService: {
      buscarAgendasPorBarberEMes: jest.fn(),
      calcularVariacaoAgendas: jest.fn(),
      buscarServicoMaisEfetuado: jest.fn(),
      buscarAgendasPorShopEMes: jest.fn(),
      compararServicosBarbeiros: jest.fn(),
      buscarServicoMaisVendidoPorShop: jest.fn(),
      buscarServicosMarcadosPorUsuario: jest.fn(),
    },
  }));
  
  const { GraficosService } = require('../../services/GraficosService');
  
  describe('GraficosController', () => {
    const mockRes = () => {
      const res = {};
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn();
      return res;
    };
  
    const mockReq = (params) => ({ params });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    test('getAgendasPorBarberEMes - should return agendas for barber and month', async () => {
      const req = mockReq({ id: '1', mes: '2025-01' });
      const res = mockRes();
      const mockData = [{ agendaId: 1 }];
  
      GraficosService.buscarAgendasPorBarberEMes.mockResolvedValue(mockData);
  
      await getAgendasPorBarberEMes(req, res);
  
      expect(GraficosService.buscarAgendasPorBarberEMes).toHaveBeenCalledWith('1', '2025-01');
      expect(res.json).toHaveBeenCalledWith(mockData);
    });
  
    test('compararAgendasMeses - should calculate agenda variation', async () => {
      const req = mockReq({ id: '1' });
      const res = mockRes();
      const mockData = { variation: 10 };
  
      GraficosService.calcularVariacaoAgendas.mockResolvedValue(mockData);
  
      await compararAgendasMeses(req, res);
  
      expect(GraficosService.calcularVariacaoAgendas).toHaveBeenCalledWith('1');
      expect(res.json).toHaveBeenCalledWith(mockData);
    });
  
    test('getServicoMaisEfetuado - should return the most performed service', async () => {
      const req = mockReq({ id: '1', mes: '2025-01' });
      const res = mockRes();
      const mockData = { service: 'Haircut' };
  
      GraficosService.buscarServicoMaisEfetuado.mockResolvedValue(mockData);
  
      await getServicoMaisEfetuado(req, res);
  
      expect(GraficosService.buscarServicoMaisEfetuado).toHaveBeenCalledWith('1', '2025-01');
      expect(res.json).toHaveBeenCalledWith(mockData);
    });
  
    test('getAgendasPorShopEMes - should return agendas for shop and month', async () => {
      const req = mockReq({ id: '1', mes: '2025-01' });
      const res = mockRes();
      const mockData = [{ agendaId: 1 }];
  
      GraficosService.buscarAgendasPorShopEMes.mockResolvedValue(mockData);
  
      await getAgendasPorShopEMes(req, res);
  
      expect(GraficosService.buscarAgendasPorShopEMes).toHaveBeenCalledWith('1', '2025-01');
      expect(res.json).toHaveBeenCalledWith(mockData);
    });
  
    test('compararServicosBarbeiros - should compare barber services', async () => {
      const req = mockReq({ id: '1', mes: '2025-01' });
      const res = mockRes();
      const mockData = { comparison: 'Barber1 > Barber2' };
  
      GraficosService.compararServicosBarbeiros.mockResolvedValue(mockData);
  
      await compararServicosBarbeiros(req, res);
  
      expect(GraficosService.compararServicosBarbeiros).toHaveBeenCalledWith('1', '2025-01');
      expect(res.json).toHaveBeenCalledWith(mockData);
    });
  
    test('getServicoMaisVendidoPorShop - should return the most sold service in shop', async () => {
      const req = mockReq({ id: '1' });
      const res = mockRes();
      const mockData = { service: 'Shaving' };
  
      GraficosService.buscarServicoMaisVendidoPorShop.mockResolvedValue(mockData);
  
      await getServicoMaisVendidoPorShop(req, res);
  
      expect(GraficosService.buscarServicoMaisVendidoPorShop).toHaveBeenCalledWith('1');
      expect(res.json).toHaveBeenCalledWith(mockData);
    });
  
    test('getServicosMarcadosPorUsuario - should return user marked services', async () => {
      const req = mockReq({ id: '1' });
      const res = mockRes();
      const mockData = [{ service: 'Haircut' }];
  
      GraficosService.buscarServicosMarcadosPorUsuario.mockResolvedValue(mockData);
  
      await getServicosMarcadosPorUsuario(req, res);
  
      expect(GraficosService.buscarServicosMarcadosPorUsuario).toHaveBeenCalledWith('1');
      expect(res.json).toHaveBeenCalledWith(mockData);
    });
  
    test('should handle errors', async () => {
      const req = mockReq({ id: '1' });
      const res = mockRes();
      const mockError = new Error('Test error');
  
      GraficosService.buscarServicosMarcadosPorUsuario.mockRejectedValue(mockError);
  
      await getServicosMarcadosPorUsuario(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: mockError.message });
    });
  });
  