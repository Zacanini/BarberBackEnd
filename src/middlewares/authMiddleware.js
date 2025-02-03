// filepath: /D:/BarbersBr/BarberBackEnd/middleware/authMiddleware.js
const { verifyToken } = require('../../utils/jwt');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
  
  if (!token) {
    return res.status(401).json({ mensagem: 'Token não fornecido' });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // Isso incluirá o oauthId
    next();
  } catch (error) {
    return res.status(401).json({ mensagem: 'Token inválido' });
  }
};

module.exports = authMiddleware;