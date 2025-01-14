'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Agendas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nomeServico: {
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
        allowNull: false,
        references: {
          model: 'Barbers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      idUser: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      dataMarcada: {
        type: Sequelize.DATE,
        allowNull: false
      },
      horario: {
        type: Sequelize.TIME,
        allowNull: false
      },
      valorDoServico: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      formaDePagamento: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isIn: [['dinheiro', 'cartao', 'pix']]
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
    await queryInterface.dropTable('Agendas');
  }
};