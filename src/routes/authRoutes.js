// authRoutes.js
const express = require('express');
const passport = require('../../config/passport');
const { generateToken } = require('../../utils/jwt');
const router = express.Router();

// Inicia o login com Google
router.get('/auth/google', (req, res, next) => {
  const role = req.query.role; // Recebe o parâmetro 'role' do frontend
  if (!role) {
    console.log('Role não informado');
    return res.status(400).json({ mensagem: 'Role não informado' });
  }
  const state = Buffer.from(JSON.stringify({ role })).toString('base64'); // Codifica o role

  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: state // Passa o role codificado como state
  })(req, res, next);
});

// Callback do Google
router.get('/auth/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: '/login' }), // Desabilita sessão
  (req, res) => {
    if(!req.user) {
      console.log('Erro ao realizar login com Google');
      return res.status(401).json({ mensagem: 'Erro ao realizar login com Google' });
    }
    console.log(`Login com Google realizado com sucesso: ${req.user} `);
    // Gera o token JWT com as informações do usuário
    const token = generateToken(req.user);
    console.log('Token gerado com sucesso: ', token);

    // Redireciona para o frontend com o token e informações do usuário
    res.redirect(`http://localhost:3000/login-success?token=${token}&user=${encodeURIComponent(JSON.stringify(req.user))}`);
    console.log('Redirecionando para o frontend...');
  }
);

// Rota de logout
router.get('/logout', (req, res) => {
  req.logout();
  res.json({ mensagem: 'Logout realizado com sucesso' });
});

module.exports = router;