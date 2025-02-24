const { Barber } = require('../../models');
const bcrypt = require('bcrypt');

// Função para gerar senha aleatória
function gerarSenhaAleatoria(tamanho) {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let senha = '';
  for (let i = 0; i < tamanho; i++) {
    senha += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return senha;
}

const createBarber = async (data) => {
  // Gere uma senha aleatória de 6 caracteres
  const senhaNaoCriptografada = gerarSenhaAleatoria(6);
  
  // Criptografe a senha antes de salvar no banco de dados
  const salt = await bcrypt.genSalt(10);
  const senhaCriptografada = await bcrypt.hash(senhaNaoCriptografada, salt);

  // Combine os dados originais com a senha criptografada
  const barberData = {
    ...data,
    senhaIdentificacao: senhaCriptografada,
  };

  // Crie o barbeiro com os dados combinados
  const barber = await Barber.create(barberData);

  // Retorne o barbeiro e a senha não criptografada
  return { ...barber.get(), senhaNaoCriptografada };
};

const getAllBarbers = async () => {
  return await Barber.findAll();
};

const getBarberById = async (id) => {
  return await Barber.findByPk(id);
};

const updateBarber = async (id, data) => {
  const barber = await Barber.findByPk(id);
  if (barber) {
    // Se a senhaIdentificacao estiver sendo atualizada, criptografe-a
    if (data.senhaIdentificacao) {
      const salt = await bcrypt.genSalt(10);
      data.senhaIdentificacao = await bcrypt.hash(data.senhaIdentificacao, salt);
    }
    return await barber.update(data);
  }
  return null;
};

const deleteBarber = async (id) => {
  const barber = await Barber.findByPk(id);
  if (barber) {
    await barber.destroy();
    return true;
  }
  return false;
};

module.exports = {
  createBarber,
  getAllBarbers,
  getBarberById,
  updateBarber,
  deleteBarber,
  getBarbersByShopId,
};