// passport.test.js
process.env.GOOGLE_CLIENT_ID = 'test-client-id';
process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret';


const passport = require('../passport');
const { User, Shop } = require('../../models');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const SequelizeMock = require('sequelize-mock');

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
    }),
  };
});

beforeEach(() => {
    jest.clearAllMocks(); // Limpa os mocks entre os testes
  
    User.findOne = jest.fn();
    User.create = jest.fn();
    User.findByPk = jest.fn();
    Shop.findOne = jest.fn();
    Shop.findByPk = jest.fn();
  });
  

describe('Passport.js Google Strategy', () => {
  let strategy;

  beforeAll(() => {
    strategy = passport._strategy('google');
  });

  test('GoogleStrategy should be configured correctly', () => {
    expect(strategy).toBeInstanceOf(GoogleStrategy);
    expect(strategy._oauth2._clientId).toBe(process.env.GOOGLE_CLIENT_ID);
    expect(strategy._oauth2._clientSecret).toBe(process.env.GOOGLE_CLIENT_SECRET);
  });

  test('should authenticate a user with role "user"', async () => {
    const req = { query: { state: Buffer.from(JSON.stringify({ role: 'user' })).toString('base64') } };
    const profile = {
      id: 'google-id-123',
      displayName: 'Test User',
      emails: [{ value: 'user@test.com' }],
      photos: [{ value: 'http://example.com/photo.jpg' }],
    };
    const done = jest.fn();
  
    User.findOne.mockResolvedValue({ id: 1, nome: 'Test User', oauthId: 'google-id-123' });
    
    await strategy._verify(req, null, null, profile, done);
  
    expect(User.findOne).toHaveBeenCalledWith({ where: { oauthId: profile.id } });
    expect(done).toHaveBeenCalledWith(null, expect.objectContaining({ nome: 'Test User' }));
  });
  

  test('should create a user if not found', async () => {
    const req = { query: { state: Buffer.from(JSON.stringify({ role: 'user' })).toString('base64') } };
    const profile = {
      id: 'google-id-new',
      displayName: 'New User',
      emails: [{ value: 'newuser@test.com' }],
      photos: [{ value: 'http://example.com/newphoto.jpg' }],
    };
    const done = jest.fn();
  
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({ id: 2, nome: 'New User', oauthId: 'google-id-new' });
  
    await strategy._verify(req, null, null, profile, done);
  
    expect(User.create).toHaveBeenCalledWith({
      oauthId: profile.id,
      nome: profile.displayName,
      email: profile.emails[0].value,
      img: profile.photos[0].value,
    });
    expect(done).toHaveBeenCalledWith(null, expect.objectContaining({ nome: 'New User' }));
  });
  

  test('should handle errors during authentication', async () => {
    const req = { query: { state: Buffer.from(JSON.stringify({ role: 'user' })).toString('base64') } };
    const profile = {
      id: 'google-id-error',
      displayName: 'Error User',
      emails: [{ value: 'error@test.com' }],
      photos: [{ value: 'http://example.com/errorphoto.jpg' }],
    };
    const done = jest.fn();
  
    User.findOne.mockRejectedValue(new Error('Test Error'));
  
    await strategy._verify(req, null, null, profile, done);
  
    expect(done).toHaveBeenCalledWith(expect.any(Error), false);
  });
  

  test('should authenticate a shop with role "shop"', async () => {
    const req = { query: { state: Buffer.from(JSON.stringify({ role: 'shop' })).toString('base64') } };
    const profile = {
      id: 'google-id-456',
      displayName: 'Test Shop',
      emails: [{ value: 'shop@test.com' }],
      photos: [{ value: 'http://example.com/photo.jpg' }],
    };
    const done = jest.fn();

    await strategy._verify(req, null, null, profile, done);

    expect(Shop.findOne).toHaveBeenCalledWith({ where: { oauthId: profile.id } });
    expect(done).toHaveBeenCalledWith(null, expect.objectContaining({ nome: 'Test Shop' }));
  });
});

describe('Passport.js serialization', () => {
  test('serializeUser should store user ID', () => {
    const done = jest.fn();
    passport.serializeUser({ id: 123 }, done);
    expect(done).toHaveBeenCalledWith(null, 123);
  });

  test('deserializeUser should find user by ID', async () => {
    const done = jest.fn();
    User.findByPk.mockResolvedValue({ id: 123, nome: 'Test User' });
  
    await passport.deserializeUser(123, done);
  
    expect(User.findByPk).toHaveBeenCalledWith(123);
    expect(done).toHaveBeenCalledWith(null, expect.objectContaining({ nome: 'Test User' }));
  });

});
