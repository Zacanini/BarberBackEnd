// routes/mpRoutes.js
const express = require('express');
const router = express.Router();
const { createPreferenceBasicController, createPreferenceMediumController, createPreferencePremiumController } = require('../controllers/MPcontroller');
const authMiddleware = require('../middlewares/authMiddleware'); // Importe o middleware

router.post('/create-preference-basic', authMiddleware, createPreferenceBasicController);
router.post('/create-preference-medio', authMiddleware, createPreferenceMediumController);
router.post('/create-preference-premium', authMiddleware, createPreferencePremiumController);

module.exports = router;