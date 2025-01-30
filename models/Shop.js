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
    },
    whatsapp: {
      type: DataTypes.STRING
    },
    subscription_status: {
      type: DataTypes.ENUM('active', 'inactive', 'canceled', 'trial'),
      defaultValue: 'inactive'
    },
    subscription_plan: {
      type: DataTypes.ENUM('basic', 'premium', 'enterprise'),
      defaultValue: null
    },
    subscription_start_date: {
      type: DataTypes.DATE,
      defaultValue: null
    },
    subscription_end_date: {
      type: DataTypes.DATE,
      defaultValue: null
    },
    mp_subscription_id: {
      type: DataTypes.STRING,
      defaultValue: null
    },
    trial_end_date: {
      type: DataTypes.DATE,
      defaultValue: null
    }
  }, {});
  Shop.associate = function(models) {
    Shop.hasMany(models.Barber, { foreignKey: 'idShop' });
    Shop.hasMany(models.Servico, { foreignKey: 'idShop' });
    Shop.hasMany(models.Agenda, { foreignKey: 'idShop' });
  };
  return Shop;
};