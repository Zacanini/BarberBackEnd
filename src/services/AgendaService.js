const { Agenda } = require('../../models');

const createAgenda = async (data) => {
  return await Agenda.create(data);
};

const getAllAgendas = async () => {
  return await Agenda.findAll();
};

const getAgendaById = async (id) => {
  return await Agenda.findByPk(id);
};

const updateAgenda = async (id, data) => {
  const agenda = await Agenda.findByPk(id);
  if (agenda) {
    return await agenda.update(data);
  }
  return null;
};

const deleteAgenda = async (id) => {
  const agenda = await Agenda.findByPk(id);
  if (agenda) {
    await agenda.destroy();
    return true;
  }
  return false;
};

module.exports = {
  createAgenda,
  getAllAgendas,
  getAgendaById,
  updateAgenda,
  deleteAgenda
};