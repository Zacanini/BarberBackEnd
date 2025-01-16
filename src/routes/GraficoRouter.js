const express = require('express');
const router = express.Router();
const graficosController = require('../controllers/GraficosController');

router.get('/agendas/barber/:id/:mes', graficosController.getAgendasPorBarberEMes);
router.get('/comparar/agendas/:id', graficosController.compararAgendasMeses);
router.get('/servico/mais-efetuado/:id/:mes', graficosController.getServicoMaisEfetuado);
router.get('/agendas/shop/:id/:mes', graficosController.getAgendasPorShopEMes);
router.get('/comparar/servicos/:id/:mes', graficosController.compararServicosBarbeiros);
router.get('/servico/mais-vendido/:id', graficosController.getServicoMaisVendidoPorShop);
router.get('/servicos/marcados/:id', graficosController.getServicosMarcadosPorUsuario);

module.exports = router;