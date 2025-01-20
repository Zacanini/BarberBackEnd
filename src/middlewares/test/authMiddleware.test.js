const { verifyToken } = require('../../../utils/jwt');
const authMiddleware = require('../authMiddleware');

// filepath: /D:/BarbersBr/BarberBackEnd/middleware/authMiddleware.test.js

jest.mock('../../../utils/jwt');

describe('authMiddleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar 401 se o token não for fornecido', () => {
    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ mensagem: 'Token não fornecido' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve chamar next se o token for válido', () => {
    const decoded = { id: 1, email: 'test@example.com' };
    req.headers['authorization'] = 'validToken';
    verifyToken.mockReturnValue(decoded);

    authMiddleware(req, res, next);

    expect(verifyToken).toHaveBeenCalledWith('validToken');
    expect(req.user).toBe(decoded);
    expect(next).toHaveBeenCalled();
  });

  it('deve retornar 401 se o token for inválido', () => {
    req.headers['authorization'] = 'invalidToken';
    verifyToken.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ mensagem: 'Token inválido' });
    expect(next).not.toHaveBeenCalled();
  });
});