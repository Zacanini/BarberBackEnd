const { Servico } = require('../../models');

const createServico = async (data) => {
  return await Servico.create(data);
};

const getAllServicos = async () => {
  return await Servico.findAll();
};

const getServicoById = async (id) => {
  return await Servico.findByPk(id);
};

const getServicosByShopId = async (idShop) => {
  return await Servico.findAll({
    where: { idShop }
  });
};

const updateServico = async (id, data) => {
  const servico = await Servico.findByPk(id);
  if (servico) {
    return await servico.update(data);
  }
  return null;
};

const deleteServico = async (id) => {
  const servico = await Servico.findByPk(id);
  if (servico) {
    await servico.destroy();
    return true;
  }
  return false;
};

module.exports = {
  createServico,
  getAllServicos,
  getServicoById,
  updateServico,
  deleteServico,
  getServicosByShopId
};