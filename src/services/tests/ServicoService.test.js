const { Servico } = require('../../../models');
const { updateServico } = require('../ServicoService');

// filepath: /D:/BarbersBr/BarberBackEnd/src/services/ServicoService.test.js

jest.mock('../../../models', () => ({
  Servico: {
    findByPk: jest.fn(),
  }
}));

describe('ServicoService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('updateServico', () => {
    it('deve atualizar o serviço se encontrado', async () => {
      const servico = { id: 1, nome: 'Serviço Teste', update: jest.fn().mockResolvedValue(true) };
      const data = { nome: 'Serviço Atualizado' };
      Servico.findByPk.mockResolvedValue(servico);

      const result = await updateServico(1, data);

      expect(Servico.findByPk).toHaveBeenCalledWith(1);
      expect(servico.update).toHaveBeenCalledWith(data);
      expect(result).toBe(true);
    });

    it('deve retornar null se o serviço não for encontrado', async () => {
      Servico.findByPk.mockResolvedValue(null);

      const result = await updateServico(1, { nome: 'Serviço Atualizado' });

      expect(Servico.findByPk).toHaveBeenCalledWith(1);
      expect(result).toBeNull();
    });

    it('deve lançar um erro se houver um problema com o banco de dados', async () => {
      const errorMessage = 'Erro no banco de dados';
      Servico.findByPk.mockRejectedValue(new Error(errorMessage));

      await expect(updateServico(1, { nome: 'Serviço Atualizado' })).rejects.toThrow(errorMessage);
    });
  });
});