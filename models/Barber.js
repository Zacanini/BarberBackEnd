const bcrypt = require('bcrypt');

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
    },
    senhaIdentificacao: {
      type: DataTypes.STRING,
      allowNull: true // Permite que seja nulo, caso o barbeiro seja criado por OAuth
    }
  }, {
    hooks: {
      beforeCreate: async (barber) => {
        if (barber.senhaIdentificacao) {
          const salt = await bcrypt.genSalt(10);
          barber.senhaIdentificacao = await bcrypt.hash(barber.senhaIdentificacao, salt);
        }
      },
      beforeUpdate: async (barber) => {
        if (barber.senhaIdentificacao) {
          const salt = await bcrypt.genSalt(10);
          barber.senhaIdentificacao = await bcrypt.hash(barber.senhaIdentificacao, salt);
        }
      }
    },
    instanceMethods: {
      validarSenha: async function(senha) {
        return await bcrypt.compare(senha, this.senhaIdentificacao);
      }
    }
  });

  Barber.associate = function(models) {
    Barber.belongsTo(models.Shop, { foreignKey: 'idShop' });
    Barber.hasMany(models.Servico, { foreignKey: 'idBarber' });
    Barber.hasMany(models.Agenda, { foreignKey: 'idBarber' });
  };

  return Barber;
};