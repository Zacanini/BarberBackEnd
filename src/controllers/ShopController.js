const shopService = require('../services/ShopService');

const criarShop = async (req, res) => {
  try {
    const shop = await shopService.createShop(req.body);
    res.status(201).json(shop);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao criar a barbearia', erro: error.message });
  }
};

const listarShops = async (req, res) => {
  try {
    const shops = await shopService.getAllShops();
    res.status(200).json(shops);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao listar as barbearias', erro: error.message });
  }
};

const obterShopPorId = async (req, res) => {
  try {
    const shop = await shopService.getShopById(req.params.id);
    if (shop) {
      res.status(200).json(shop);
    } else {
      res.status(404).json({ mensagem: 'Barbearia não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao obter a barbearia', erro: error.message });
  }
};

const atualizarShop = async (req, res) => {
  try {
    const shop = await shopService.updateShop(req.params.id, req.body);
    if (shop) {
      res.status(200).json(shop);
    } else {
      res.status(404).json({ mensagem: 'Barbearia não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao atualizar a barbearia', erro: error.message });
  }
};

const deletarShop = async (req, res) => {
  try {
    const sucesso = await shopService.deleteShop(req.params.id);
    if (sucesso) {
      res.status(204).send();
    } else {
      res.status(404).json({ mensagem: 'Barbearia não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao deletar a barbearia', erro: error.message });
  }
};

module.exports = {
  criarShop,
  listarShops,
  obterShopPorId,
  atualizarShop,
  deletarShop
};