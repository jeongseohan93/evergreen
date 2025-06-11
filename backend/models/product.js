const { Model, DataTypes } = require('sequelize');

class Product extends Model {
  static initiate(sequelize) {
    return super.init({
      product_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      lineup_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      memo: {
        type: DataTypes.TEXT,
      },
      small_photo: {
        type: DataTypes.STRING(255),
      },
      large_photo: {
        type: DataTypes.STRING(255),
      },
      stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    }, {
      sequelize,
      modelName: 'Product',
      tableName: 'products',
      timestamps: false,
      underscored: false,
    });
  }

  static associate(db) {
    db.Product.belongsTo(db.Category, {
      foreignKey: 'category_id',
      onDelete: 'CASCADE', 
    });

    db.Product.belongsTo(db.Lineup, {
      foreignKey: 'lineup_id',
      onDelete: 'SET NULL', 
    });
  }
}

module.exports = Product;
