module.exports = (sequelize, DataTypes) => {
    const Servico = sequelize.define('Servico', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      nome: {
        type: DataTypes.STRING,
        allowNull: false
      },
      idShop: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      idBarber: {
        type: DataTypes.INTEGER
      },
      valor: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      duracao: {
        type: DataTypes.INTERVAL,
        allowNull: false
      }
    }, {});
    Servico.associate = function(models) {
      Servico.belongsTo(models.Shop, { foreignKey: 'idShop' });
      Servico.belongsTo(models.Barber, { foreignKey: 'idBarber' });
    };
    return Servico;
  };