// passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User, Shop } = require('../models');
const { generateToken } = require('../utils/jwt'); 

// Função auxiliar para decodificar e validar o state
const decodeAndValidateState = (req) => {
  try {
    if (!req.query.state) {
      console.error('Estado não fornecido na requisição');
      throw new Error('MISSING_STATE');
    }
    
    const decodedState = Buffer.from(req.query.state, 'base64').toString('utf8');
    const state = JSON.parse(decodedState);
    
    if (!state.role || !['user', 'shop'].includes(state.role)) {
      console.error('Role inválido ou não fornecido:', state.role);
      throw new Error('INVALID_ROLE');
    }
    
    return state;
  } catch (error) {
    console.error('Erro ao processar state:', error.message);
    throw error;
  }
};

// Configuração da estratégia do Google
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
  passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    const state = decodeAndValidateState(req);
    const { role } = state;
    const Model = role === 'shop' ? Shop : User;
    const email = profile.emails?.[0]?.value;

    if (!email) {
      return done(new Error('EMAIL_REQUIRED'), false);
    }

    const baseData = {
      oauthId: profile.id,
      nome: profile.displayName,
      email: email,
      img: profile.photos?.[0]?.value || null
    };

    const shopData = role === 'shop' ? {
      numeroDeFuncionarios: 0,
      horaAbertura: '09:00:00',
      horaDeFechamento: '18:00:00',
      whatsapp: '',
      subscription_status: 'inactive',
      trial_end_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // Trial de 5 dias
    } : {};

    const [user, created] = await Model.findOrCreate({
      where: { oauthId: profile.id },
      defaults: { ...baseData, ...shopData }
    });

    // Verifique se o trial acabou ou se a assinatura está ativa
    if (role === 'shop') {
      const shop = user;
      const now = new Date();
      if (shop.subscription_status !== 'active' && shop.trial_end_date < now) {
        return done(new Error('SUBSCRIPTION_EXPIRED'), false);
      }
    }

    return done(null, user);

  } catch (error) {
    return done(error, false);
  }
}));

// Serialização otimizada
passport.serializeUser((user, done) => {
  done(null, {
    id: user.id,
    type: user.constructor.name
  });
});

// Deserialização otimizada
// config/passport.js
passport.deserializeUser(async (serialized, done) => {
  try {
    const Model = serialized.type === 'User' ? User : Shop;
    const user = await Model.findByPk(serialized.id, {
      attributes: [
        'id', 
        'oauthId', 
        'nome', 
        'email', 
        'img', // Adicione este campo
        'subscription_status', 
        'trial_end_date'
      ]
    });
    
    done(null, user || false);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;