const { Barber } = require('../../models');

const createBarber = async (data) => {
  return await Barber.create(data);
};

const getAllBarbers = async () => {
  return await Barber.findAll();
};

const getBarberById = async (id) => {
  return await Barber.findByPk(id);
};

const updateBarber = async (id, data) => {
  const barber = await Barber.findByPk(id);
  if (barber) {
    return await barber.update(data);
  }
  return null;
};

const deleteBarber = async (id) => {
  const barber = await Barber.findByPk(id);
  if (barber) {
    await barber.destroy();
    return true;
  }
  return false;
};

module.exports = {
  createBarber,
  getAllBarbers,
  getBarberById,
  updateBarber,
  deleteBarber
};