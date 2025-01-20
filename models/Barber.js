module.exports = (sequelize, DataTypes) => {
  const Barber = sequelize.define('Barber', {
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
    oauthId: {
      type: DataTypes.STRING
    },
    tipoBarber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['gerente', 'funcionario']]
      }
    },
    whatsapp: {
      type: DataTypes.STRING // Adicionando a coluna whatsapp
    }
  }, {});
  Barber.associate = function(models) {
    Barber.belongsTo(models.Shop, { foreignKey: 'idShop' });
    Barber.hasMany(models.Servico, { foreignKey: 'idBarber' });
    Barber.hasMany(models.Agenda, { foreignKey: 'idBarber' });
  };
  return Barber;
};