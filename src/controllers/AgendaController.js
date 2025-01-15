const agendaService = require('../services/AgendaService');

const criarAgenda = async (req, res) => {
  try {
    const agenda = await agendaService.createAgenda(req.body);
    res.status(201).json(agenda);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao criar a agenda', erro: error.message });
  }
};

const listarAgendas = async (req, res) => {
  try {
    const agendas = await agendaService.getAllAgendas();
    res.status(200).json(agendas);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao listar as agendas', erro: error.message });
  }
};

const obterAgendaPorId = async (req, res) => {
  try {
    const agenda = await agendaService.getAgendaById(req.params.id);
    if (agenda) {
      res.status(200).json(agenda);
    } else {
      res.status(404).json({ mensagem: 'Agenda não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao obter a agenda', erro: error.message });
  }
};

const atualizarAgenda = async (req, res) => {
  try {
    const agenda = await agendaService.updateAgenda(req.params.id, req.body);
    if (agenda) {
      res.status(200).json(agenda);
    } else {
      res.status(404).json({ mensagem: 'Agenda não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao atualizar a agenda', erro: error.message });
  }
};

const deletarAgenda = async (req, res) => {
  try {
    const sucesso = await agendaService.deleteAgenda(req.params.id);
    if (sucesso) {
      res.status(204).send();
    } else {
      res.status(404).json({ mensagem: 'Agenda não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao deletar a agenda', erro: error.message });
  }
};

module.exports = {
  criarAgenda,
  listarAgendas,
  obterAgendaPorId,
  atualizarAgenda,
  deletarAgenda
};