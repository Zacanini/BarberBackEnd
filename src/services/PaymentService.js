const { Payment } = require('../../models');

const createPayment = async (data) => {
  return await Payment.create(data);
};

const getAllPayments = async () => {
  return await Payment.findAll();
};

const getPaymentById = async (id) => {
  return await Payment.findByPk(id);
};

const updatePayment = async (id, data) => {
  const payment = await Payment.findByPk(id);
  if (payment) {
    return await payment.update(data);
  }
  return null;
};

const deletePayment = async (id) => {
  const payment = await Payment.findByPk(id);
  if (payment) {
    await payment.destroy();
    return true;
  }
  return false;
};

module.exports = {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment
};