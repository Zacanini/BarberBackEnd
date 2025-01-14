'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Servicos', {
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
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      idBarber: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Barbers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      valor: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      duracao: {
        type: Sequelize.STRING, // Sequelize.INTERVAL não é suportado diretamente, use STRING
        allowNull: false
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
    await queryInterface.dropTable('Servicos');
  }
};