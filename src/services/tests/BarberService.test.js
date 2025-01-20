const { Barber } = require('../../../models');
const {
  createBarber,
  getAllBarbers,
  getBarberById,
  updateBarber,
  deleteBarber
} = require('../BarberService');

jest.mock('../../../models', () => ({
  Barber: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
  }
}));

describe('BarberService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createBarber', () => {
    it('should create a new barber', async () => {
      const data = { name: 'Test Barber' };
      const createdBarber = { id: 1, ...data };
      Barber.create.mockResolvedValue(createdBarber);

      const result = await createBarber(data);

      expect(Barber.create).toHaveBeenCalledWith(data);
      expect(result).toBe(createdBarber);
    });
  });

  describe('getAllBarbers', () => {
    // Testes já presentes
  });

  describe('getBarberById', () => {
    it('should return the barber by id', async () => {
      const barber = { id: 1, name: 'Test Barber' };
      Barber.findByPk.mockResolvedValue(barber);

      const result = await getBarberById(1);

      expect(Barber.findByPk).toHaveBeenCalledWith(1);
      expect(result).toBe(barber);
    });

    it('should return null if the barber is not found', async () => {
      Barber.findByPk.mockResolvedValue(null);

      const result = await getBarberById(1);

      expect(Barber.findByPk).toHaveBeenCalledWith(1);
      expect(result).toBeNull();
    });
  });

  describe('updateBarber', () => {
    it('should update the barber if found', async () => {
      const barber = { id: 1, name: 'Test Barber', update: jest.fn().mockResolvedValue(true) };
      const data = { name: 'Updated Barber' };
      Barber.findByPk.mockResolvedValue(barber);

      const result = await updateBarber(1, data);

      expect(Barber.findByPk).toHaveBeenCalledWith(1);
      expect(barber.update).toHaveBeenCalledWith(data);
      expect(result).toBe(true);
    });

    it('should return null if the barber is not found', async () => {
      Barber.findByPk.mockResolvedValue(null);

      const result = await updateBarber(1, { name: 'Updated Barber' });

      expect(Barber.findByPk).toHaveBeenCalledWith(1);
      expect(result).toBeNull();
    });
  });

  describe('deleteBarber', () => {
    it('should delete the barber if found', async () => {
      const barber = { id: 1, name: 'Test Barber', destroy: jest.fn().mockResolvedValue(true) };
      Barber.findByPk.mockResolvedValue(barber);

      const result = await deleteBarber(1);

      expect(Barber.findByPk).toHaveBeenCalledWith(1);
      expect(barber.destroy).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false if the barber is not found', async () => {
      Barber.findByPk.mockResolvedValue(null);

      const result = await deleteBarber(1);

      expect(Barber.findByPk).toHaveBeenCalledWith(1);
      expect(result).toBe(false);
    });
  });
});
