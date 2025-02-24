const { Sequelize } = require('sequelize');
const config = require('./config.json').development;

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    port: 5432,
    dialectOptions: config.dialectOptions,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000, // Tempo máximo, em milissegundos, para adquirir uma conexão antes de lançar um erro
        idle: 10000 // Tempo máximo, em milissegundos, que uma conexão pode ficar ociosa antes de ser liberada
      }
});

module.exports = sequelize;