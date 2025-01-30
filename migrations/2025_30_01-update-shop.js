'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Shops', 'subscription_status', {
      type: Sequelize.ENUM('active', 'inactive', 'canceled', 'trial'),
      defaultValue: 'inactive'
    });
    await queryInterface.addColumn('Shops', 'subscription_plan', {
      type: Sequelize.ENUM('basic', 'premium', 'enterprise'),
      defaultValue: null
    });
    await queryInterface.addColumn('Shops', 'subscription_start_date', {
      type: Sequelize.DATE,
      defaultValue: null
    });
    await queryInterface.addColumn('Shops', 'subscription_end_date', {
      type: Sequelize.DATE,
      defaultValue: null
    });
    await queryInterface.addColumn('Shops', 'mp_subscription_id', {
      type: Sequelize.STRING,
      defaultValue: null
    });
    await queryInterface.addColumn('Shops', 'trial_end_date', {
      type: Sequelize.DATE,
      defaultValue: null
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Shops', 'subscription_status');
    await queryInterface.removeColumn('Shops', 'subscription_plan');
    await queryInterface.removeColumn('Shops', 'subscription_start_date');
    await queryInterface.removeColumn('Shops', 'subscription_end_date');
    await queryInterface.removeColumn('Shops', 'mp_subscription_id');
    await queryInterface.removeColumn('Shops', 'trial_end_date');
  }
};