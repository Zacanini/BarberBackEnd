const paymentService = require('../services/PaymentService');

const criarPayment = async (req, res) => {
  try {
    const payment = await paymentService.createPayment(req.body);
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao criar o pagamento', erro: error.message });
  }
};

const listarPayments = async (req, res) => {
  try {
    const payments = await paymentService.getAllPayments();
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao listar os pagamentos', erro: error.message });
  }
};

const obterPaymentPorId = async (req, res) => {
  try {
    const payment = await paymentService.getPaymentById(req.params.id);
    if (payment) {
      res.status(200).json(payment);
    } else {
      res.status(404).json({ mensagem: 'Pagamento não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao obter o pagamento', erro: error.message });
  }
};

const atualizarPayment = async (req, res) => {
  try {
    const payment = await paymentService.updatePayment(req.params.id, req.body);
    if (payment) {
      res.status(200).json(payment);
    } else {
      res.status(404).json({ mensagem: 'Pagamento não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao atualizar o pagamento', erro: error.message });
  }
};

const deletarPayment = async (req, res) => {
  try {
    const sucesso = await paymentService.deletePayment(req.params.id);
    if (sucesso) {
      res.status(204).send();
    } else {
      res.status(404).json({ mensagem: 'Pagamento não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao deletar o pagamento', erro: error.message });
  }
};

module.exports = {
  criarPayment,
  listarPayments,
  obterPaymentPorId,
  atualizarPayment,
  deletarPayment
};