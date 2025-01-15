const servicoService = require('../services/ServicoService');

const criarServico = async (req, res) => {
  try {
    const servico = await servicoService.createServico(req.body);
    res.status(201).json(servico);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao criar o serviço', erro: error.message });
  }
};

const listarServicos = async (req, res) => {
  try {
    const servicos = await servicoService.getAllServicos();
    res.status(200).json(servicos);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao listar os serviços', erro: error.message });
  }
};

const obterServicoPorId = async (req, res) => {
  try {
    const servico = await servicoService.getServicoById(req.params.id);
    if (servico) {
      res.status(200).json(servico);
    } else {
      res.status(404).json({ mensagem: 'Serviço não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao obter o serviço', erro: error.message });
  }
};

const atualizarServico = async (req, res) => {
  try {
    const servico = await servicoService.updateServico(req.params.id, req.body);
    if (servico) {
      res.status(200).json(servico);
    } else {
      res.status(404).json({ mensagem: 'Serviço não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao atualizar o serviço', erro: error.message });
  }
};

const deletarServico = async (req, res) => {
  try {
    const sucesso = await servicoService.deleteServico(req.params.id);
    if (sucesso) {
      res.status(204).send();
    } else {
      res.status(404).json({ mensagem: 'Serviço não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao deletar o serviço', erro: error.message });
  }
};

module.exports = {
  criarServico,
  listarServicos,
  obterServicoPorId,
  atualizarServico,
  deletarServico
};