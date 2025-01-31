module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.addColumn('Shops', 'email', {
        type: Sequelize.STRING,
        allowNull: true
      });
      await queryInterface.addColumn('Shops', 'img', {
        type: Sequelize.TEXT,
        allowNull: true
      });
    },
  
    down: async (queryInterface) => {
      await queryInterface.removeColumn('Shops', 'email');
      await queryInterface.removeColumn('Shops', 'img');
    }
  };