const { User } = require('../../../models');

const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../UserService');

jest.mock('../../../models', () => ({
  User: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
  }
}));

describe('UserService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('deve criar um novo usuário', async () => {
      const data = { name: 'Test User', email: 'test@example.com' };
      const createdUser = { id: 1, ...data };
      User.create.mockResolvedValue(createdUser);

      const result = await createUser(data);

      expect(User.create).toHaveBeenCalledWith(data);
      expect(result).toBe(createdUser);
    });
  });

  describe('getAllUsers', () => {
    it('deve retornar todos os usuários', async () => {
      const users = [{ id: 1, name: 'Test User', email: 'test@example.com' }];
      User.findAll.mockResolvedValue(users);

      const result = await getAllUsers();

      expect(User.findAll).toHaveBeenCalled();
      expect(result).toBe(users);
    });

    it('deve retornar um array vazio se nenhum usuário for encontrado', async () => {
      User.findAll.mockResolvedValue([]);

      const result = await getAllUsers();

      expect(User.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('deve lançar um erro se houver um problema com o banco de dados', async () => {
      const errorMessage = 'Erro no banco de dados';
      User.findAll.mockRejectedValue(new Error(errorMessage));

      await expect(getAllUsers()).rejects.toThrow(errorMessage);
    });
  });

  describe('getUserById', () => {
    it('deve retornar o usuário pelo id', async () => {
      const user = { id: 1, name: 'Test User', email: 'test@example.com' };
      User.findByPk.mockResolvedValue(user);

      const result = await getUserById(1);

      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(result).toBe(user);
    });

    it('deve retornar null se o usuário não for encontrado', async () => {
      User.findByPk.mockResolvedValue(null);

      const result = await getUserById(1);

      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(result).toBeNull();
    });

    it('deve lançar um erro se houver um problema com o banco de dados', async () => {
      const errorMessage = 'Erro no banco de dados';
      User.findByPk.mockRejectedValue(new Error(errorMessage));

      await expect(getUserById(1)).rejects.toThrow(errorMessage);
    });
  });

  describe('updateUser', () => {
    it('deve atualizar o usuário se encontrado', async () => {
      const user = { id: 1, name: 'Test User', email: 'test@example.com', update: jest.fn().mockResolvedValue(true) };
      const data = { name: 'Updated User' };
      User.findByPk.mockResolvedValue(user);

      const result = await updateUser(1, data);

      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(user.update).toHaveBeenCalledWith(data);
      expect(result).toBe(true);
    });

    it('deve retornar null se o usuário não for encontrado', async () => {
      User.findByPk.mockResolvedValue(null);

      const result = await updateUser(1, { name: 'Updated User' });

      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(result).toBeNull();
    });

    it('deve lançar um erro se houver um problema com o banco de dados', async () => {
      const errorMessage = 'Erro no banco de dados';
      User.findByPk.mockRejectedValue(new Error(errorMessage));

      await expect(updateUser(1, { name: 'Updated User' })).rejects.toThrow(errorMessage);
    });
  });

  describe('deleteUser', () => {
    it('deve deletar o usuário se encontrado', async () => {
      const user = { id: 1, name: 'Test User', email: 'test@example.com', destroy: jest.fn().mockResolvedValue(true) };
      User.findByPk.mockResolvedValue(user);

      const result = await deleteUser(1);

      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(user.destroy).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('deve retornar false se o usuário não for encontrado', async () => {
      User.findByPk.mockResolvedValue(null);

      const result = await deleteUser(1);

      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(result).toBe(false);
    });

    it('deve lançar um erro se houver um problema com o banco de dados', async () => {
      const errorMessage = 'Erro no banco de dados';
      User.findByPk.mockRejectedValue(new Error(errorMessage));

      await expect(deleteUser(1)).rejects.toThrow(errorMessage);
    });
  });
});
