module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define('Payment', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      shop_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Shops',
          key: 'id'
        }
      },
      mp_payment_id: {
        type: DataTypes.STRING,
        allowNull: false
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      currency: {
        type: DataTypes.STRING,
        defaultValue: 'BRL'
      },
      status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected', 'refunded'),
        defaultValue: 'pending'
      },
      payment_method: {
        type: DataTypes.STRING,
        allowNull: true
      },
      invoice_url: {
        type: DataTypes.STRING,
        allowNull: true
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      timestamps: true,
      underscored: true
    });
  
    Payment.associate = function(models) {
      Payment.belongsTo(models.Shop, { foreignKey: 'shop_id' });
    };
  
    return Payment;
  };