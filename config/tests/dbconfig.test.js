const { Sequelize } = require('sequelize');
const sequelize = require('../dbconfig.js'); // Atualize com o caminho correto do seu arquivo de conexão

jest.mock('sequelize');

describe('Database Connection', () => {
  const config = {
    database: 'barbeiros',
    username: 'postgres',
    password: 'LobWJDiKS70nSFme',
    host: 'tipsily-healthy-ptarmigan.data-1.use1.tembo.io',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    pool: undefined,
  };

  it('should create a Sequelize instance with the correct configuration', () => {
    expect(Sequelize).toHaveBeenCalledWith(
      config.database,
      config.username,
      config.password,
      {
        host: config.host,
        dialect: config.dialect,
        port: config.port,
        dialectOptions: config.dialectOptions,
        pool: config.pool,
      }
    );
  });

  it('should authenticate the database connection successfully', async () => {
    sequelize.authenticate = jest.fn().mockResolvedValueOnce();

    await expect(sequelize.authenticate()).resolves.not.toThrow();
    expect(sequelize.authenticate).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if authentication fails', async () => {
    const errorMessage = 'Failed to connect to the database';
    sequelize.authenticate = jest.fn().mockRejectedValueOnce(new Error(errorMessage));

    await expect(sequelize.authenticate()).rejects.toThrow(errorMessage);
    expect(sequelize.authenticate).toHaveBeenCalledTimes(1);
  });
});
