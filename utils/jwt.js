// filepath: /D:/BarbersBr/BarberBackEnd/utils/jwt.js
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  console.log('jwt.js: Gerando token JWT para o usuário:', user.id);
  const token = jwt.sign({ 
    id: user.id, 
    email: user.email,
    oauthId: user.oauthId // Adicione o oauthId aqui
  }, process.env.JWT_SECRET, { expiresIn: '1h' });
  console.log('jwt.js: Token JWT gerado com sucesso');
  return token;
};

const verifyToken = (token) => {
  console.log('jwt.js: Verificando token JWT');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('jwt.js: Token JWT verificado com sucesso');
    return decoded;
  } catch (error) {
    console.error('jwt.js: Erro ao verificar token JWT:', error.message);
    throw error;
  }
};

module.exports = {
  generateToken,
  verifyToken
};