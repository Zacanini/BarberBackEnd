const barberService = require('../services/BarberService');
const { Barber } = require('../../models');

const criarBarber = async (req, res) => {
  try {
    const { barber, senhaNaoCriptografada } = await barberService.createBarber(req.body);
    // Envie a senha não criptografada na resposta (apenas para criação)
    res.status(201).json({ ...barber, senhaNaoCriptografada });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao criar o barbeiro', erro: error.message });
  }
};

const listarBarbers = async (req, res) => {
  try {
    const barbers = await barberService.getAllBarbers();
    res.status(200).json(barbers);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao listar os barbeiros', erro: error.message });
  }
};

const obterBarberPorId = async (req, res) => {
  try {
    const barber = await barberService.getBarberById(req.params.id);
    if (barber) {
      res.status(200).json(barber);
    } else {
      res.status(404).json({ mensagem: 'Barbeiro não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao obter o barbeiro', erro: error.message });
  }
};

const obterBarbersPorIdShop = async (req, res) => {
  try {
    const barbers = await barberService.getBarbersByShopId(req.params.idShop);
    res.status(200).json(barbers);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao buscar barbeiros', erro: error.message });
  }
};

const atualizarBarber = async (req, res) => {
  try {
    const barber = await barberService.updateBarber(req.params.id, req.body);
    if (barber) {
      res.status(200).json(barber);
    } else {
      res.status(404).json({ mensagem: 'Barbeiro não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao atualizar o barbeiro', erro: error.message });
  }
};

const deletarBarber = async (req, res) => {
  try {
    const sucesso = await barberService.deleteBarber(req.params.id);
    if (sucesso) {
      res.status(204).send();
    } else {
      res.status(404).json({ mensagem: 'Barbeiro não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao deletar o barbeiro', erro: error.message });
  }
};

module.exports = {
  criarBarber,
  listarBarbers,
  obterBarberPorId,
  atualizarBarber,
  deletarBarber,
  obterBarbersPorIdShop
};