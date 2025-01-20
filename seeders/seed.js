const { sequelize, Shop, User, Barber, Servico, Agenda } = require('../models');

async function seed() {
  try {
    // Conectar ao banco de dados
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados bem-sucedida!');

    // Sincronizar os modelos com o banco de dados
    await sequelize.sync({ force: true }); // Use { force: true } para recriar as tabelas

    // Adicionar dados na tabela Shop
    const shop1 = await Shop.create({
      nome: 'Barbearia Central',
      whatsapp: '',
      numeroDeFuncionarios: 5,
      horaAbertura: '09:00:00',
      horaDeFechamento: '18:00:00'
    });

    // Adicionar dados na tabela User
    const user1 = await User.create({
      oauthId: 'oauth123',
      nome: 'João Silva',
      email: 'joao.silva@example.com',
      img: 'https://example.com/img/joao.jpg',
      whatsapp: ''
    });

    // Adicionar dados na tabela Barber
    const barber1 = await Barber.create({
      nome: 'Carlos Souza',
      idShop: shop1.id,
      oauthId: 'oauth456',
      whatsapp: '',
      tipoBarber: 'gerente'
    });

    // Adicionar dados na tabela Servico
    const servico1 = await Servico.create({
      nome: 'Corte de Cabelo',
      idShop: shop1.id,
      idBarber: barber1.id,
      valor: 30.00,
      duracao: '00:30:00' // Usando STRING para duracao
    });

    // Adicionar dados na tabela Agenda
    const agenda1 = await Agenda.create({
      nomeServico: 'Corte de Cabelo',
      idShop: shop1.id,
      idBarber: barber1.id,
      idUser: user1.id,
      dataMarcada: '2023-11-01',
      horario: '10:00:00',
      valorDoServico: 30.00,
      formaDePagamento: 'cartao'
    });

    console.log('Dados adicionados com sucesso!');
  } catch (error) {
    console.error('Erro ao adicionar dados:', error);
  } finally {
    // Fechar a conexão com o banco de dados
    await sequelize.close();
  }
}

seed();