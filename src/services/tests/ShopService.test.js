const { Shop } = require('../../../models');

// filepath: /D:/BarbersBr/BarberBackEnd/src/services/ShopService.test.js
const {
  createShop,
  getAllShops,
  getShopById,
  updateShop,
  deleteShop
} = require('../ShopService');

jest.mock('../../../models', () => ({
  Shop: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
  }
}));

describe('ShopService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createShop', () => {
    it('deve criar uma nova loja', async () => {
      const data = { name: 'Test Shop' };
      const createdShop = { id: 1, ...data };
      Shop.create.mockResolvedValue(createdShop);

      const result = await createShop(data);

      expect(Shop.create).toHaveBeenCalledWith(data);
      expect(result).toBe(createdShop);
    });
  });

  describe('getAllShops', () => {
    it('deve retornar todas as lojas', async () => {
      const shops = [{ id: 1, name: 'Test Shop' }];
      Shop.findAll.mockResolvedValue(shops);

      const result = await getAllShops();

      expect(Shop.findAll).toHaveBeenCalled();
      expect(result).toBe(shops);
    });

    it('deve retornar um array vazio se nenhuma loja for encontrada', async () => {
      Shop.findAll.mockResolvedValue([]);

      const result = await getAllShops();

      expect(Shop.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('deve lançar um erro se houver um problema com o banco de dados', async () => {
      const errorMessage = 'Erro no banco de dados';
      Shop.findAll.mockRejectedValue(new Error(errorMessage));

      await expect(getAllShops()).rejects.toThrow(errorMessage);
    });
  });

  describe('getShopById', () => {
    it('deve retornar a loja pelo id', async () => {
      const shop = { id: 1, name: 'Test Shop' };
      Shop.findByPk.mockResolvedValue(shop);

      const result = await getShopById(1);

      expect(Shop.findByPk).toHaveBeenCalledWith(1);
      expect(result).toBe(shop);
    });

    it('deve retornar null se a loja não for encontrada', async () => {
      Shop.findByPk.mockResolvedValue(null);

      const result = await getShopById(1);

      expect(Shop.findByPk).toHaveBeenCalledWith(1);
      expect(result).toBeNull();
    });

    it('deve lançar um erro se houver um problema com o banco de dados', async () => {
      const errorMessage = 'Erro no banco de dados';
      Shop.findByPk.mockRejectedValue(new Error(errorMessage));

      await expect(getShopById(1)).rejects.toThrow(errorMessage);
    });
  });

  describe('updateShop', () => {
    it('deve atualizar a loja se encontrada', async () => {
      const shop = { id: 1, name: 'Test Shop', update: jest.fn().mockResolvedValue(true) };
      const data = { name: 'Updated Shop' };
      Shop.findByPk.mockResolvedValue(shop);

      const result = await updateShop(1, data);

      expect(Shop.findByPk).toHaveBeenCalledWith(1);
      expect(shop.update).toHaveBeenCalledWith(data);
      expect(result).toBe(true);
    });

    it('deve retornar null se a loja não for encontrada', async () => {
      Shop.findByPk.mockResolvedValue(null);

      const result = await updateShop(1, { name: 'Updated Shop' });

      expect(Shop.findByPk).toHaveBeenCalledWith(1);
      expect(result).toBeNull();
    });

    it('deve lançar um erro se houver um problema com o banco de dados', async () => {
      const errorMessage = 'Erro no banco de dados';
      Shop.findByPk.mockRejectedValue(new Error(errorMessage));

      await expect(updateShop(1, { name: 'Updated Shop' })).rejects.toThrow(errorMessage);
    });
  });

  describe('deleteShop', () => {
    it('deve deletar a loja se encontrada', async () => {
      const shop = { id: 1, name: 'Test Shop', destroy: jest.fn().mockResolvedValue(true) };
      Shop.findByPk.mockResolvedValue(shop);

      const result = await deleteShop(1);

      expect(Shop.findByPk).toHaveBeenCalledWith(1);
      expect(shop.destroy).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('deve retornar false se a loja não for encontrada', async () => {
      Shop.findByPk.mockResolvedValue(null);

      const result = await deleteShop(1);

      expect(Shop.findByPk).toHaveBeenCalledWith(1);
      expect(result).toBe(false);
    });

    it('deve lançar um erro se houver um problema com o banco de dados', async () => {
      const errorMessage = 'Erro no banco de dados';
      Shop.findByPk.mockRejectedValue(new Error(errorMessage));

      await expect(deleteShop(1)).rejects.toThrow(errorMessage);
    });
  });
});