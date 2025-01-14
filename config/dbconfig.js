const { Sequelize } = require('sequelize');
const config = require('./config.json').development;

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    port: 5432,
    dialectOptions: config.dialectOptions,
    pool: config.pool
});

module.exports = sequelize;