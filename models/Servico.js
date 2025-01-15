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
      allowNull: false,
      references: {
        model: 'Shops',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    idBarber: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Barbers',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    valor: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    duracao: {
      type: DataTypes.STRING, // Alterado para STRING
      allowNull: false
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {});
  Servico.associate = function(models) {
    Servico.belongsTo(models.Shop, { foreignKey: 'idShop' });
    Servico.belongsTo(models.Barber, { foreignKey: 'idBarber' });
  };
  return Servico;
};