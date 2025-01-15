const userService = require('../services/UserService');

const criarUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao criar o usuário', erro: error.message });
  }
};

const listarUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao listar os usuários', erro: error.message });
  }
};

const obterUserPorId = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao obter o usuário', erro: error.message });
  }
};

const atualizarUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao atualizar o usuário', erro: error.message });
  }
};

const deletarUser = async (req, res) => {
  try {
    const sucesso = await userService.deleteUser(req.params.id);
    if (sucesso) {
      res.status(204).send();
    } else {
      res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao deletar o usuário', erro: error.message });
  }
};

module.exports = {
  criarUser,
  listarUsers,
  obterUserPorId,
  atualizarUser,
  deletarUser
};