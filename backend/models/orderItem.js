const { Model, DataTypes } = require('sequelize');

class OrderItem extends Model {
  static initiate(sequelize) {
    return super.init({
      order_item_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      cart_item_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      user_uuid: {
        type: DataTypes.CHAR(36), //user모델과 같은 타입을 공유
        allowNull: false,
        collate: 'utf8_general_ci',
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }
    }, {
      sequelize,
      modelName: 'OrderItem',
      tableName: 'order_items',
      timestamps: false,
      underscored: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
    // Order 관계
    db.OrderItem.belongsTo(db.Order, {
      foreignKey: 'order_id',
      targetKey: 'order_id',
      onDelete: 'CASCADE',
    });

    // User 관계
    db.OrderItem.belongsTo(db.User, {
      foreignKey: 'user_uuid',
      targetKey: 'user_uuid',
      onDelete: 'CASCADE',
    });
  }
}

module.exports = OrderItem;

