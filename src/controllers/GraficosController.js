const { GraficosService } = require('../services/GraficosService');

const getAgendasPorBarberEMes = async (req, res) => {
  const { id, mes } = req.params;
  try {
    const result = await GraficosService.buscarAgendasPorBarberEMes(id, mes);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const compararAgendasMeses = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await GraficosService.calcularVariacaoAgendas(id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getServicoMaisEfetuado = async (req, res) => {
  const { id, mes } = req.params;
  try {
    const result = await GraficosService.buscarServicoMaisEfetuado(id, mes);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAgendasPorShopEMes = async (req, res) => {
  const { id, mes } = req.params;
  try {
    const result = await GraficosService.buscarAgendasPorShopEMes(id, mes);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const compararServicosBarbeiros = async (req, res) => {
  const { id, mes } = req.params;
  try {
    const result = await GraficosService.compararServicosBarbeiros(id, mes);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getServicoMaisVendidoPorShop = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await GraficosService.buscarServicoMaisVendidoPorShop(id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getServicosMarcadosPorUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await GraficosService.buscarServicosMarcadosPorUsuario(id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAgendasPorBarberEMes,
  compararAgendasMeses,
  getServicoMaisEfetuado,
  getAgendasPorShopEMes,
  compararServicosBarbeiros,
  getServicoMaisVendidoPorShop,
  getServicosMarcadosPorUsuario
};