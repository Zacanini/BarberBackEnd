const express = require('express');
const router = express.Router();
const agendaController = require('../controllers/AgendaController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/agendas',authMiddleware , agendaController.criarAgenda);
router.get('/agendas',authMiddleware , agendaController.listarAgendas);
router.get('/agendas/:id',authMiddleware , agendaController.obterAgendaPorId);
router.put('/agendas/:id',authMiddleware , agendaController.atualizarAgenda);
router.delete('/agendas/:id',authMiddleware , agendaController.deletarAgenda);

module.exports = router;