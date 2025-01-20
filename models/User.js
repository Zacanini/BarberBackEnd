module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      oauthId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      nome: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      img: {
        type: DataTypes.TEXT
      },
      whatsapp: {
        type: DataTypes.STRING // Adicionando a coluna whatsapp
      }
    }, {});
    User.associate = function(models) {
      User.hasMany(models.Agenda, { foreignKey: 'idUser' });
    };
    return User;
  };