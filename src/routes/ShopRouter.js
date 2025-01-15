const express = require('express');
const router = express.Router();
const shopController = require('../controllers/ShopController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/shops', authMiddleware, shopController.criarShop);
router.get('/shops', authMiddleware, shopController.listarShops);
router.get('/shops/:id', authMiddleware, shopController.obterShopPorId);
router.put('/shops/:id', authMiddleware, shopController.atualizarShop);
router.delete('/shops/:id', authMiddleware, shopController.deletarShop);

module.exports = router;