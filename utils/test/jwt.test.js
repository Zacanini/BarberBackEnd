const jwt = require('jsonwebtoken');
const { generateToken, verifyToken } = require('../jwt');

// filepath: /D:/BarbersBr/BarberBackEnd/utils/jwt.test.js

jest.mock('jsonwebtoken');

describe('JWT Utils', () => {
  const user = { id: 1, email: 'test@example.com' };
  const token = 'fakeToken';
  const secret = 'secret';

  beforeAll(() => {
    process.env.JWT_SECRET = secret;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateToken', () => {
    it('should generate a token with the correct payload and options', () => {
      jwt.sign.mockReturnValue(token);

      const result = generateToken(user);

      expect(jwt.sign).toHaveBeenCalledWith(
        { id: user.id, email: user.email },
        secret,
        { expiresIn: '1h' }
      );
      expect(result).toBe(token);
    });
  });

  describe('verifyToken', () => {
    it('should verify the token and return the payload', () => {
      const payload = { id: user.id, email: user.email };
      jwt.verify.mockReturnValue(payload);

      const result = verifyToken(token);

      expect(jwt.verify).toHaveBeenCalledWith(token, secret);
      expect(result).toBe(payload);
    });

    it('should throw an error if the token is invalid', () => {
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(() => verifyToken(token)).toThrow('Invalid token');
    });
  });
});