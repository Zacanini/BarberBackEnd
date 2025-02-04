// passport.test.js
process.env.GOOGLE_CLIENT_ID = 'test-client-id';
process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret';

const passport = require('../passport');
const { User, Shop } = require('../../models');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Helper para criar datas relativas
const addDays = (days) => new Date(Date.now() + days * 24 * 60 * 60 * 1000);

jest.mock('../../models', () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();
  return {
    User: dbMock.define('User', {
      id: 1,
      oauthId: 'google-id-123',
      nome: 'Test User',
      email: 'user@test.com',
      img: 'http://example.com/photo.jpg'
    }),
    Shop: dbMock.define('Shop', {
      id: 2,
      oauthId: 'google-id-456',
      nome: 'Test Shop',
      email: 'shop@test.com',
      img: 'http://example.com/photo.jpg',
      numeroDeFuncionarios: 0,
      horaAbertura: '09:00:00',
      horaDeFechamento: '18:00:00',
      whatsapp: '0987654321',
      subscription_status: 'inactive',
      trial_end_date: addDays(5) // Trial de 5 dias
    }),
  };
});

beforeEach(() => {
  jest.clearAllMocks();
  User.findOrCreate = jest.fn();
  Shop.findOrCreate = jest.fn();
});

describe('Passport.js Google Strategy', () => {
  let strategy;

  beforeAll(() => {
    strategy = passport._strategy('google');
  });

  test('Deve configurar a GoogleStrategy corretamente', () => {
    expect(strategy).toBeInstanceOf(GoogleStrategy);
    expect(strategy.name).toBe('google');
    expect(strategy._oauth2._clientId).toBe(process.env.GOOGLE_CLIENT_ID);
    expect(strategy._oauth2._clientSecret).toBe(process.env.GOOGLE_CLIENT_SECRET);
  });

  describe('Fluxo de Autenticação', () => {
    const mockProfile = (role, id, email) => ({
      id: id || `google-id-${Math.random()}`,
      displayName: `Test ${role.charAt(0).toUpperCase() + role.slice(1)}`, // Capitalized
      emails: [{ value: email || `${role}@test.com` }],
      photos: [{ value: 'http://example.com/photo.jpg' }]
    });

    test('Deve autenticar usuário existente com dados corretos', async () => {
      const req = { 
        query: { 
          state: Buffer.from(JSON.stringify({ role: 'user' })).toString('base64') 
        } 
      };
      const done = jest.fn();

      User.findOrCreate.mockResolvedValue([{ 
        id: 1,
        oauthId: 'google-id-123',
        nome: 'Test User',
        email: 'user@test.com'
      }, false]);

      await strategy._verify(req, null, null, mockProfile('user'), done);
      
      expect(User.findOrCreate).toHaveBeenCalledWith({
        where: { oauthId: expect.any(String) },
        defaults: expect.objectContaining({
          oauthId: expect.any(String),
          nome: 'Test User', // Verifica capitalização
          email: 'user@test.com',
          img: 'http://example.com/photo.jpg'
        })
      });
      expect(done).toHaveBeenCalledWith(null, expect.anything());
    });

    test('Deve criar nova loja com trial de 5 dias e campos padrão', async () => {
      const req = { 
        query: { 
          state: Buffer.from(JSON.stringify({ role: 'shop' })).toString('base64') 
        } 
      };
      const done = jest.fn();

      Shop.findOrCreate.mockResolvedValue([{
        id: 2,
        subscription_status: 'inactive',
        trial_end_date: addDays(5)
      }, true]);

      await strategy._verify(req, null, null, mockProfile('shop'), done);
      
      expect(Shop.findOrCreate).toHaveBeenCalledWith({
        where: { oauthId: expect.any(String) },
        defaults: expect.objectContaining({
          numeroDeFuncionarios: 0,
          horaAbertura: '09:00:00',
          horaDeFechamento: '18:00:00',
          subscription_status: 'inactive',
          trial_end_date: expect.any(Date) // Verifica se é uma instância de Date
        })
      });
    });

    test('Deve bloquear login para lojas com trial expirado', async () => {
      const req = { 
        query: { 
          state: Buffer.from(JSON.stringify({ role: 'shop' })).toString('base64') 
        } 
      };
      const done = jest.fn();

      Shop.findOrCreate.mockResolvedValue([{
        subscription_status: 'inactive',
        trial_end_date: addDays(-1) // Trial expirado
      }, false]);

      await strategy._verify(req, null, null, mockProfile('shop'), done);
      
      expect(done).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'SUBSCRIPTION_EXPIRED' }),
        false
      );
    });
  });

  describe('Tratamento de Erros', () => {
    test('Deve rejeitar autenticação sem state', async () => {
      const req = { query: {} };
      const done = jest.fn();

      await strategy._verify(req, null, null, {}, done);
      expect(done).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'MISSING_STATE' }),
        false
      );
    });

    test('Deve rejeitar autenticação sem email', async () => {
      const req = { 
        query: { 
          state: Buffer.from(JSON.stringify({ role: 'user' })).toString('base64') 
        } 
      };
      const done = jest.fn();

      await strategy._verify(req, null, null, { 
        id: '123', 
        displayName: 'User',
        photos: [] 
      }, done);
      
      expect(done).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'EMAIL_REQUIRED' }),
        false
      );
    });
  });
});

describe('Serialização/Desserialização', () => {
  const mockUser = {
    id: 1,
    oauthId: 'google-123',
    nome: 'User',
    email: 'user@test.com',
    constructor: { name: 'User' }
  };

  test('Deve serializar tipo e ID corretamente', () => {
    const done = jest.fn();
    passport.serializeUser(mockUser, done);
    expect(done).toHaveBeenCalledWith(null, {
      id: 1,
      type: 'User'
    });
  });

  test('Deve desserializar loja com campos completos', async () => {
    const mockShop = {
      id: 2,
      oauthId: 'google-456',
      nome: 'Shop',
      email: 'shop@test.com',
      img: 'http://example.com/photo.jpg',
      subscription_status: 'active',
      trial_end_date: addDays(30)
    };
    
    Shop.findByPk = jest.fn().mockResolvedValue(mockShop);
    const done = jest.fn();

    await passport.deserializeUser({ id: 2, type: 'Shop' }, done);
    
    expect(Shop.findByPk).toHaveBeenCalledWith(2, {
      attributes: [
        'id', 
        'oauthId', 
        'nome', 
        'email', 
        'img', 
        'subscription_status', 
        'trial_end_date'
      ]
    });
    expect(done).toHaveBeenCalledWith(null, mockShop);
  });
});