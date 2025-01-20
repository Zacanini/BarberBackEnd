const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User, Shop } = require('../models');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
  passReqToCallback: true // Passar a requisição para o callback
},
async (req, accessToken, refreshToken, profile, done) => {
  try {
    const state = JSON.parse(Buffer.from(req.query.state, 'base64').toString('utf8')); // Obter o estado que contém o parâmetro de consulta 'role'
    const role = state.role;
    let user;

    if (!['user', 'shop'].includes(role)) {
      return done(new Error('Invalid role provided'), false);
    }
    
    if (role === 'shop') {
      // Verificar se o estabelecimento já existe no banco de dados
      user = await Shop.findOne({ where: { oauthId: profile.id } });
      if (!user) {
        // Se não existir, criar um novo estabelecimento
        user = await Shop.create({
          oauthId: profile.id,
          nome: profile.displayName,
          email: profile.emails?.[0]?.value || '', // Verificar se o email existe
          img: profile.photos?.[0]?.value || '', // Verificar se a imagem existe
          numeroDeFuncionarios: 0, // Inicialmente 0, pode ser atualizado posteriormente
          horaAbertura: '09:00:00', // Valores padrão, podem ser atualizados posteriormente
          horaDeFechamento: '18:00:00',
          whatsapp: '' // Adicionar o campo de WhatsApp
        });
      }
    } else {
      // Verificar se o usuário já existe no banco de dados
      user = await User.findOne({ where: { oauthId: profile.id } });
      if (!user) {
        // Se não existir, criar um novo usuário
        user = await User.create({
          oauthId: profile.id,
          nome: profile.displayName,
          email: profile.emails?.[0]?.value || '', // Verificar se o email existe
          img: profile.photos?.[0]?.value || '', // Verificar se a imagem existe
          whatsapp: '' // Adicionar o campo de WhatsApp
        });
      }
    }

    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    let user = await User.findByPk(id);
    if (user) {
      return done(null, user);
    }

    const shop = await Shop.findByPk(id);
    if (shop) {
      return done(null, shop);
    }

    return done(null, null); // Nenhum usuário ou estabelecimento encontrado
  } catch (err) {
    return done(err);
  }
});

module.exports = passport;