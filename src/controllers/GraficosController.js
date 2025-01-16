const { GraficosService } = require('../services/GraficosService');

class GraficosController {
  async getAgendasPorBarberEMes(req, res) {
    const { id, mes } = req.params;
    try {
      const result = await GraficosService.buscarAgendasPorBarberEMes(id, mes);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async compararAgendasMeses(req, res) {
    const { id } = req.params;
    try {
      const result = await GraficosService.calcularVariacaoAgendas(id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getServicoMaisEfetuado(req, res) {
    const { id, mes } = req.params;
    try {
      const result = await GraficosService.buscarServicoMaisEfetuado(id, mes);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAgendasPorShopEMes(req, res) {
    const { id, mes } = req.params;
    try {
      const result = await GraficosService.buscarAgendasPorShopEMes(id, mes);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async compararServicosBarbeiros(req, res) {
    const { id, mes } = req.params;
    try {
      const result = await GraficosService.compararServicosBarbeiros(id, mes);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getServicoMaisVendidoPorShop(req, res) {
    const { id } = req.params;
    try {
      const result = await GraficosService.buscarServicoMaisVendidoPorShop(id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getServicosMarcadosPorUsuario(req, res) {
    const { id } = req.params;
    try {
      const result = await GraficosService.buscarServicosMarcadosPorUsuario(id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new GraficosController();