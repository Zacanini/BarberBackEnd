// passport.test.js
process.env.GOOGLE_CLIENT_ID = 'test-client-id';
process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret';

const passport = require('../passport');
const { User, Shop } = require('../../models');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

jest.mock('../../models', () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();
  return {
    User: dbMock.define('User', {
      id: 1,
      oauthId: 'google-id-123',
      nome: 'Test User',
      email: 'user@test.com',
      img: 'http://example.com/photo.jpg',
      whatsapp: '1234567890'
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
      trial_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
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

  test('A GoogleStrategy deve ser configurada corretamente', () => {
    expect(strategy).toBeInstanceOf(GoogleStrategy);
    expect(strategy._oauth2._clientId).toBe(process.env.GOOGLE_CLIENT_ID);
    expect(strategy._oauth2._clientSecret).toBe(process.env.GOOGLE_CLIENT_SECRET);
  });

  describe('Autenticação de Usuário', () => {
    const mockProfile = (role, id) => ({
      id: id || 'google-id-123',
      displayName: `Test ${role}`,
      emails: [{ value: `${role}@test.com` }],
      photos: [{ value: 'http://example.com/photo.jpg' }]
    });

    test('deve autenticar um usuário existente', async () => {
      const req = { query: { state: Buffer.from(JSON.stringify({ role: 'user' })).toString('base64') } };
      const done = jest.fn();
    
      User.findOrCreate.mockResolvedValue([{ id: 1 }, true]);
    
      await strategy._verify(req, null, null, mockProfile('user'), done);
      
      expect(User.findOrCreate).toHaveBeenCalledWith({
        where: { oauthId: mockProfile('user').id },
        defaults: expect.objectContaining({
          oauthId: 'google-id-123',
          nome: 'Test user', // Ou 'Test User' dependendo da implementação real
          email: 'user@test.com',
          img: 'http://example.com/photo.jpg'
        })
      });
      expect(done).toHaveBeenCalledWith(null, expect.anything());
    });

    test('deve criar uma nova loja com campos padrão', async () => {
      const req = { query: { state: Buffer.from(JSON.stringify({ role: 'shop' })).toString('base64') } };
      const done = jest.fn();

      Shop.findOrCreate.mockResolvedValue([{
        id: 2,
        subscription_status: 'inactive',
        trial_end_date: expect.any(Date)
      }, true]);

      await strategy._verify(req, null, null, mockProfile('shop', 'google-id-new'), done);
      
      expect(Shop.findOrCreate).toHaveBeenCalledWith({
        where: { oauthId: 'google-id-new' },
        defaults: expect.objectContaining({
          numeroDeFuncionarios: 0,
          subscription_status: 'inactive',
          trial_end_date: expect.any(Date)
        })
      });
      expect(done).toHaveBeenCalledWith(null, expect.objectContaining({
        subscription_status: 'inactive'
      }));
    });
  });

  describe('Tratamento de Erros', () => {
    test('deve lidar com state inválido', async () => {
      const req = { query: {} };
      const done = jest.fn();

      await strategy._verify(req, null, null, {}, done);
      expect(done).toHaveBeenCalledWith(expect.objectContaining({
        message: 'MISSING_STATE'
      }), false);
    });

    test('deve lidar com role inválido', async () => {
      const req = { query: { state: Buffer.from(JSON.stringify({ role: 'invalid' })).toString('base64') } };
      const done = jest.fn();

      await strategy._verify(req, null, null, {}, done);
      expect(done).toHaveBeenCalledWith(expect.objectContaining({
        message: 'INVALID_ROLE'
      }), false);
    });
  });
});

describe('Serialização/Desserialização', () => {
  test('deve serializar tipo e ID', () => {
    const done = jest.fn();
    const user = { id: 1, constructor: { name: 'User' } };
    
    passport.serializeUser(user, done);
    expect(done).toHaveBeenCalledWith(null, {
      id: 1,
      type: 'User'
    });
  });

  test('deve desserializar uma loja corretamente', async () => {
    const mockShop = { 
      id: 2, 
      nome: 'Test Shop',
      subscription_status: 'inactive',
      trial_end_date: expect.any(Date)
    };
    const done = jest.fn();
    
    Shop.findByPk = jest.fn().mockImplementation((id, options) => {
      return Promise.resolve(mockShop);
    });

    await passport.deserializeUser({ id: 2, type: 'Shop' }, done);
    
    expect(Shop.findByPk).toHaveBeenCalledWith(2, {
      attributes: ['id', 'nome', 'email', 'img', 'subscription_status', 'trial_end_date']
    });
    expect(done).toHaveBeenCalledWith(null, mockShop);
  });
});