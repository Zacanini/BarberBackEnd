const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/PaymentController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/payments', authMiddleware, paymentController.criarPayment);
router.get('/payments', authMiddleware, paymentController.listarPayments);
router.get('/payments/:id', authMiddleware, paymentController.obterPaymentPorId);
router.put('/payments/:id', authMiddleware, paymentController.atualizarPayment);
router.delete('/payments/:id', authMiddleware, paymentController.deletarPayment);

module.exports = router;