// filepath: /D:/BarbersBr/BarberBackEnd/migrations/20250114195200-update-servico-duracao.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Servicos', 'duracao', {
      type: Sequelize.STRING,
      allowNull: false
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Servicos', 'duracao', {
      type: Sequelize.INTERVAL,
      allowNull: false
    });
  }
};