'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'whatsapp', {
      type: Sequelize.STRING
    });
    await queryInterface.addColumn('Barbers', 'whatsapp', {
      type: Sequelize.STRING
    });
    await queryInterface.addColumn('Shops', 'whatsapp', {
      type: Sequelize.STRING
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'whatsapp');
    await queryInterface.removeColumn('Barbers', 'whatsapp');
    await queryInterface.removeColumn('Shops', 'whatsapp');
  }
};