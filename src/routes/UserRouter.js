const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/users',authMiddleware, userController.criarUser);
router.get('/users',authMiddleware, userController.listarUsers);
router.get('/users/:id',authMiddleware, userController.obterUserPorId);
router.put('/users/:id',authMiddleware, userController.atualizarUser);
router.delete('/users/:id',authMiddleware, userController.deletarUser);

module.exports = router;