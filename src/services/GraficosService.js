const { Agenda, Servico } = require('../../models');

const buscarAgendasPorBarberEMes = async (idBarber, mes) => {
  return await Agenda.findAll({
    where: {
      idBarber,
      dataMarcada: {
        [Op.and]: [
          Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('dataMarcada')), mes),
          Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('dataMarcada')), new Date().getFullYear())
        ]
      }
    }
  });
};

const calcularVariacaoAgendas = async (idBarber) => {
  const mesAtual = new Date().getMonth() + 1;
  const agendasMesAtual = await buscarAgendasPorBarberEMes(idBarber, mesAtual);
  const agendasMesAnterior = await buscarAgendasPorBarberEMes(idBarber, mesAtual - 1);

  const variacao = ((agendasMesAtual.length - agendasMesAnterior.length) / (agendasMesAnterior.length || 1)) * 100;
  return variacao;
};

const buscarServicoMaisEfetuado = async (idBarber, mes) => {
  const agendas = await buscarAgendasPorBarberEMes(idBarber, mes);
  const servicosContagem = {};

  agendas.forEach(agenda => {
    const servicoId = agenda.nomeServico; // Assumindo que nomeServico é o ID do serviço
    servicosContagem[servicoId] = (servicosContagem[servicoId] || 0) + 1;
  });

  const servicoMaisEfetuado = Object.keys(servicosContagem).reduce((a, b) => servicosContagem[a] > servicosContagem[b] ? a : b);
  return servicoMaisEfetuado;
};

const buscarAgendasPorShopEMes = async (idShop, mes) => {
  return await Agenda.findAll({
    where: {
      idShop,
      dataMarcada: {
        [Op.and]: [
          Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('dataMarcada')), mes),
          Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('dataMarcada')), new Date().getFullYear())
        ]
      }
    }
  });
};

const compararServicosBarbeiros = async (idShop, mes) => {
  const barbeiros = await Barber.findAll({ where: { idShop } });
  const contagemAgendas = {};

  for (const barber of barbeiros) {
    const agendas = await buscarAgendasPorBarberEMes(barber.id, mes);
    contagemAgendas[barber.nome] = agendas.length;
  }

  return contagemAgendas;
};

const buscarServicoMaisVendidoPorShop = async (idShop) => {
  const servicos = await Servico.findAll({ where: { idShop } });
  const contagemServicos = {};

  for (const servico of servicos) {
    const agendas = await Agenda.findAll({ where: { idShop, nomeServico: servico.nome } });
    contagemServicos[servico.nome] = agendas.length;
  }

  const servicoMaisVendido = Object.keys(contagemServicos).reduce((a, b) => contagemServicos[a] > contagemServicos[b] ? a : b);
  return servicoMaisVendido;
};

const buscarServicosMarcadosPorUsuario = async (idUser) => {
  return await Agenda.findAll({ where: { idUser } });
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