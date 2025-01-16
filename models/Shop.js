module.exports = (sequelize, DataTypes) => {
  const Shop = sequelize.define('Shop', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    oauthId: {
      type: DataTypes.STRING,
      unique: true
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    numeroDeFuncionarios: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    horaAbertura: {
      type: DataTypes.TIME,
      allowNull: false
    },
    horaDeFechamento: {
      type: DataTypes.TIME,
      allowNull: false
    }
  }, {});
  Shop.associate = function(models) {
    Shop.hasMany(models.Barber, { foreignKey: 'idShop' });
    Shop.hasMany(models.Servico, { foreignKey: 'idShop' });
    Shop.hasMany(models.Agenda, { foreignKey: 'idShop' });
  };
  return Shop;
};