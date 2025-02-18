'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Shops', 'localizacao', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: ''
    });
    await queryInterface.addColumn('Shops', 'informacoes', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: ''
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Shops', 'localizacao');
    await queryInterface.removeColumn('Shops', 'informacoes');
  }
};