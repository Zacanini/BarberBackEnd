const express = require('express');
const router = express.Router();
const barberController = require('../controllers/BarberController');
const authMiddleware = require('../middlewares/authMiddleware');


router.post('/barbers',authMiddleware,  barberController.criarBarber);
router.get('/barbers',authMiddleware,  barberController.listarBarbers);
router.get('/barbers/:id',authMiddleware,  barberController.obterBarberPorId);
router.get('/barbers/shop/:idShop',authMiddleware,  barberController.obterBarbersPorIdShop);
router.put('/barbers/:id',authMiddleware,  barberController.atualizarBarber);
router.delete('/barbers/:id',authMiddleware,  barberController.deletarBarber);

module.exports = router;