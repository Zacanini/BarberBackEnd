const express = require('express');
const router = express.Router();
const servicoController = require('../controllers/ServicoController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/servicos',authMiddleware, servicoController.criarServico);
router.get('/servicos',authMiddleware, servicoController.listarServicos);
router.get('/servicos/:id',authMiddleware, servicoController.obterServicoPorId);
router.get('/servicos/shop/:idShop',authMiddleware, servicoController.obterServicosPorShopId);
router.put('/servicos/:id',authMiddleware, servicoController.atualizarServico);
router.delete('/servicos/:id',authMiddleware, servicoController.deletarServico);

module.exports = router;