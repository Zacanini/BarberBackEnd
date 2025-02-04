// authMiddleware.test.js
const { verifyToken } = require('../../../utils/jwt');
const authMiddleware = require('../authMiddleware');

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
    const decoded = { id: 1, email: 'test@example.com', oauthId: 'google-123' };
    // Adicionar o prefixo Bearer conforme esperado pelo middleware
    req.headers['authorization'] = 'Bearer validToken';
    verifyToken.mockReturnValue(decoded);

    authMiddleware(req, res, next);

    // Verificar se o token foi extraído corretamente (parte após o Bearer)
    expect(verifyToken).toHaveBeenCalledWith('validToken');
    expect(req.user).toEqual(decoded);
    expect(next).toHaveBeenCalled();
  });

  it('deve retornar 401 se o token for inválido', () => {
    // Adicionar o prefixo Bearer conforme esperado pelo middleware
    req.headers['authorization'] = 'Bearer invalidToken';
    verifyToken.mockImplementation(() => {
      throw new Error('Token inválido');
    });

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ mensagem: 'Token inválido' });
    expect(next).not.toHaveBeenCalled();
  });
});