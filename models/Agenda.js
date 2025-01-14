module.exports = (sequelize, DataTypes) => {
    const Agenda = sequelize.define('Agenda', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      nomeServico: {
        type: DataTypes.STRING,
        allowNull: false
      },
      idShop: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      idBarber: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      idUser: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      dataMarcada: {
        type: DataTypes.DATE,
        allowNull: false
      },
      horario: {
        type: DataTypes.TIME,
        allowNull: false
      },
      valorDoServico: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      formaDePagamento: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [['dinheiro', 'cartao', 'pix']]
        }
      }
    }, {});
    Agenda.associate = function(models) {
      Agenda.belongsTo(models.Shop, { foreignKey: 'idShop' });
      Agenda.belongsTo(models.Barber, { foreignKey: 'idBarber' });
      Agenda.belongsTo(models.User, { foreignKey: 'idUser' });
    };
    return Agenda;
  };