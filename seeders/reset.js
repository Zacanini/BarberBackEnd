const { sequelize, Shop, User, Barber, Servico, Agenda } = require('../models');

async function reset() {
  try {
    // Conectar ao banco de dados
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados bem-sucedida!');

    // Excluir dados de todas as tabelas com CASCADE
    await sequelize.query('TRUNCATE TABLE "Agendas" CASCADE');
    await sequelize.query('TRUNCATE TABLE "Servicos" CASCADE');
    await sequelize.query('TRUNCATE TABLE "Barbers" CASCADE');
    await sequelize.query('TRUNCATE TABLE "Users" CASCADE');
    await sequelize.query('TRUNCATE TABLE "Shops" CASCADE');

    console.log('Dados excluídos com sucesso!');
  } catch (error) {
    console.error('Erro ao excluir dados:', error);
  } finally {
    // Fechar a conexão com o banco de dados
    await sequelize.close();
  }
}

reset();