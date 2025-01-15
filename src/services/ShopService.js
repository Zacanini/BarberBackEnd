const { Shop } = require('../../models');

const createShop = async (data) => {
  return await Shop.create(data);
};

const getAllShops = async () => {
  return await Shop.findAll();
};

const getShopById = async (id) => {
  return await Shop.findByPk(id);
};

const updateShop = async (id, data) => {
  const shop = await Shop.findByPk(id);
  if (shop) {
    return await shop.update(data);
  }
  return null;
};

const deleteShop = async (id) => {
  const shop = await Shop.findByPk(id);
  if (shop) {
    await shop.destroy();
    return true;
  }
  return false;
};

module.exports = {
  createShop,
  getAllShops,
  getShopById,
  updateShop,
  deleteShop
};