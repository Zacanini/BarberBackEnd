const express = require('express');
const passport = require('../../config/passport');
const { generateToken } = require('../../utils/jwt');
const router = express.Router();

router.get('/auth/google', (req, res, next) => {
  const role = req.query.role; // Obter o parâmetro de consulta 'role'
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: Buffer.from(JSON.stringify({ role })).toString('base64') // Passar o parâmetro de consulta 'role' como estado
  })(req, res, next);
});

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  // Gerar token JWT
  const token = generateToken(req.user);
  // Retornar os dados completos do usuário ou estabelecimento junto com o token JWT
  res.json({ user: req.user, token });
});

// Rota de logout
router.get('/logout', (req, res) => {
  req.logout();
  res.json({ mensagem: 'Logout realizado com sucesso' });
});

module.exports = router;