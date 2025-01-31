// passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User, Shop } = require('../models');

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
  console.log(`Iniciando autenticação para: ${profile.displayName}`);
  
  try {
    const state = decodeAndValidateState(req);
    const { role } = state;
    const Model = role === 'shop' ? Shop : User;
    const email = profile.emails?.[0]?.value;

    if (!email) {
      console.error('Email não encontrado no perfil do Google');
      return done(new Error('EMAIL_REQUIRED'), false);
    }

    // Dados básicos comuns
    const baseData = {
      oauthId: profile.id,
      nome: profile.displayName,
      email: email,
      img: profile.photos?.[0]?.value || null
    };

    // Dados específicos para Shop
    const shopData = role === 'shop' ? {
      numeroDeFuncionarios: 0,
      horaAbertura: '09:00:00',
      horaDeFechamento: '18:00:00',
      whatsapp: '',
      subscription_status: 'inactive',
      trial_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Trial de 30 dias
    } : {};

    const [user, created] = await Model.findOrCreate({
      where: { oauthId: profile.id },
      defaults: { ...baseData, ...shopData }
    });

    console.log(`Usuário ${created ? 'criado' : 'encontrado'}: ${user.id}`);
    return done(null, user);

  } catch (error) {
    console.error('Erro na autenticação:', error.message);
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
passport.deserializeUser(async (serialized, done) => {
  try {
    console.log(`Deserializando usuário do tipo: ${serialized.type}`);
    const Model = serialized.type === 'User' ? User : Shop;
    const user = await Model.findByPk(serialized.id, {
      attributes: ['id', 'nome', 'email', 'img', 'subscription_status', 'trial_end_date']
    });
    
    if (!user) {
      console.warn('Usuário não encontrado na deserialização');
      return done(null, false);
    }
    
    done(null, user);
  } catch (error) {
    console.error('Erro na deserialização:', error);
    done(error);
  }
});

module.exports = passport;