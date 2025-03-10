const { Agenda, Servico, Barber } = require('../../models');
const { Op, Sequelize } = require('sequelize');

// Helper para filtro de data adaptado para PostgreSQL
const filterByMonthYear = (mes) => ({
  [Op.and]: [
    Sequelize.where(Sequelize.fn('EXTRACT', Sequelize.literal('MONTH FROM "dataMarcada"')), mes),
    Sequelize.where(Sequelize.fn('EXTRACT', Sequelize.literal('YEAR FROM "dataMarcada"')), new Date().getFullYear())
  ]
});

// Alternativa usando date_part (também funciona no PostgreSQL)
// const filterByMonthYear = (mes) => ({
//   [Op.and]: [
//     Sequelize.where(Sequelize.fn('date_part', 'month', Sequelize.col('dataMarcada')), mes),
//     Sequelize.where(Sequelize.fn('date_part', 'year', Sequelize.col('dataMarcada')), new Date().getFullYear())
//   ]
// });

// Busca otimizada com filtro centralizado
const buscarAgendasPorBarberEMes = async (idBarber, mes) => {
  try {
    return await Agenda.findAll({
      where: {
        idBarber,
        dataMarcada: filterByMonthYear(mes)
      }
    });
  } catch (error) {
    console.error('Erro em buscarAgendasPorBarberEMes:', error);
    throw error;
  }
};

// Cálculo de variação com tratamento de erros
const calcularVariacaoAgendas = async (idBarber) => {
  try {
    if (!idBarber) throw new Error('ID do barbeiro inválido');
    
    const mesAtual = new Date().getMonth() + 1;
    const [agendasMesAtual, agendasMesAnterior] = await Promise.all([
      buscarAgendasPorBarberEMes(idBarber, mesAtual),
      buscarAgendasPorBarberEMes(idBarber, mesAtual - 1)
    ]);

    const divisor = agendasMesAnterior.length || 1;
    return ((agendasMesAtual.length - agendasMesAnterior.length) / divisor) * 100;
  } catch (error) {
    console.error('Erro em calcularVariacaoAgendas:', error);
    throw error;
  }
};

// Consulta otimizada com agregação do banco
const buscarServicoMaisEfetuado = async (idBarber, mes) => {
  try {
    const result = await Agenda.findOne({
      attributes: [
        'nomeServico',
        [Sequelize.fn('COUNT', Sequelize.col('nomeServico')), 'total']
      ],
      where: { 
        idBarber,
        dataMarcada: filterByMonthYear(mes)
      },
      group: ['nomeServico'],
      order: [[Sequelize.literal('total'), 'DESC']]
    });

    return result?.nomeServico;
  } catch (error) {
    console.error('Erro em buscarServicoMaisEfetuado:', error);
    throw error;
  }
};

// Busca unificada usando helper
const buscarAgendasPorShopEMes = async (idShop, mes) => {
  try {
    return await Agenda.findAll({
      where: {
        idShop,
        dataMarcada: filterByMonthYear(mes)
      }
    });
  } catch (error) {
    console.error('Erro em buscarAgendasPorShopEMes:', error);
    throw error;
  }
};

// Consulta otimizada com eager loading (adaptada para PostgreSQL)
const compararServicosBarbeiros = async (idShop, mes) => {
  try {
    const barbeiros = await Barber.findAll({
      where: { idShop },
      include: [{
        model: Agenda,
        where: { dataMarcada: filterByMonthYear(mes) },
        attributes: []
      }],
      attributes: [
        'id',
        'nome',
        [Sequelize.fn('COUNT', Sequelize.col('Agendas.id')), 'totalAgendas']
      ],
      group: ['Barber.id']
    });

    return barbeiros.reduce((acc, { nome, totalAgendas }) => ({
      ...acc,
      [nome]: parseInt(totalAgendas)
    }), {});
  } catch (error) {
    console.error('Erro em compararServicosBarbeiros:', error);
    throw error;
  }
};

// Consulta agregada otimizada
const buscarServicoMaisVendidoPorShop = async (idShop) => {
  try {
    const result = await Agenda.findOne({
      attributes: [
        'nomeServico',
        [Sequelize.fn('COUNT', Sequelize.col('nomeServico')), 'total']
      ],
      where: { idShop },
      group: ['nomeServico'],
      order: [[Sequelize.literal('total'), 'DESC']]
    });

    return result?.nomeServico;
  } catch (error) {
    console.error('Erro em buscarServicoMaisVendidoPorShop:', error);
    throw error;
  }
};

// Mantido como está (método básico)
const buscarServicosMarcadosPorUsuario = async (idUser) => {
  try {
    return await Agenda.findAll({ 
      where: { idUser },
      order: [['dataMarcada', 'DESC']]
    });
  } catch (error) {
    console.error('Erro em buscarServicosMarcadosPorUsuario:', error);
    throw error;
  }
};

module.exports = {
  buscarAgendasPorBarberEMes,
  calcularVariacaoAgendas,
  buscarServicoMaisEfetuado,
  buscarAgendasPorShopEMes,
  compararServicosBarbeiros,
  buscarServicoMaisVendidoPorShop,
  buscarServicosMarcadosPorUsuario
};