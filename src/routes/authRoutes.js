// authRoutes.js
const express = require('express');
const passport = require('../../config/passport');
const { generateToken } = require('../../utils/jwt');
const router = express.Router();

// Inicia o login com Google
router.get('/auth/google', (req, res, next) => {
  console.log('authRoutes.js: Iniciando rota /auth/google');
  const role = req.query.role; // Recebe o parâmetro 'role' do frontend
  console.log(`authRoutes.js: Role recebido do frontend: ${role}`);
  if (!role) {
    console.log('authRoutes.js: Role não informado');
    return res.status(400).json({ mensagem: 'Role não informado' });
  }
  const state = Buffer.from(JSON.stringify({ role })).toString('base64'); // Codifica o role
  console.log(`authRoutes.js: Role codificado em base64: ${state}`);

  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: state // Passa o role codificado como state
  })(req, res, next);
  console.log('authRoutes.js: Chamando passport.authenticate para Google');
});

// Callback do Google
router.get('/auth/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }), // Desabilita sessão
  (req, res) => {
    console.log('authRoutes.js: Rota /auth/google/callback chamada');
    if(!req.user) {
      console.log('authRoutes.js: Erro ao realizar login com Google');
      return res.status(401).json({ mensagem: 'Erro ao realizar login com Google' });
    }
    console.log(`authRoutes.js: Login com Google realizado com sucesso: ${req.user.id} `);
    // Gera o token JWT com as informações do usuário
    const token = generateToken(req.user);
    console.log('authRoutes.js: Token JWT gerado com sucesso: ', token);

    // Redireciona para uma rota interna
    res.redirect(`/auth/success?token=${token}`);
    console.log(`authRoutes.js: Redirecionando para /auth/success?token=${token}`);
  }
);

router.get('/auth/success', (req, res) => {
  console.log('authRoutes.js: Rota /auth/success chamada');
  const token = req.query.token;
  console.log(`authRoutes.js: Token recebido via query string: ${token}`);

  if (!token) {
    console.log('authRoutes.js: Token não encontrado');
    return res.status(400).json({ mensagem: 'Token não encontrado' });
  }

  const cookieOptions = {
    secure: process.env.NODE_ENV ,
    maxAge: 24 * 60 * 60 * 1000 // 1 dia
  };

  if (process.env.NODE_ENV === 'production') {
    cookieOptions.httpOnly = true;
    cookieOptions.sameSite = 'strict';
  }

  // Define o cookie
  res.cookie('authToken', token, cookieOptions);
  console.log('authRoutes.js: Cookie authToken definido com sucesso');

  // Redireciona para o frontend
  res.redirect('http://localhost:3000/login-success');
  console.log('authRoutes.js: Redirecionando para http://localhost:3000/login-success');
});

// Rota de logout
router.get('/logout', (req, res) => {
  console.log('authRoutes.js: Rota /logout chamada');
  
  // Adicione uma função de callback vazia
  req.logout((err) => {
    if (err) {
      console.log('Erro no logout:', err);
      return res.status(500).send('Erro no logout');
    }
    
    console.log('authRoutes.js: Chamando req.logout() com sucesso');
    
    // Limpa o cookie (adicione as mesmas opções usadas na criação)
    res.clearCookie('authToken', {
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });
    
    console.log('authRoutes.js: Cookie authToken removido com sucesso');
    
    // Redireciona
    res.redirect('http://localhost:3000/signin');
  });
});

module.exports = router;