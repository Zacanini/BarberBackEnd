'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Barbers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false
      },
      idShop: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Shops',
          key: 'id'
        }
      },
      oauthId: {
        type: Sequelize.STRING
      },
      tipoBarber: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isIn: [['gerente', 'funcionario']]
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Barbers');
  }
};