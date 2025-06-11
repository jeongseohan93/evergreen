// Product models를 위한 준비

// Product에는 category_id, lineup_id를 외래키로 둘 예정이나 
// 작업의 용이성을 위해 차후 외래키 설정을 하는것으로 하겠다.

// 외래키 제외 컬럼
// name VARCHAR(100) NOT NULL - 상품명
// price INT NOT NULL - 가격
// memo TEXT - 간단 설명 (ex. 프리리그 전용 로드! )
// small_photo VARCHAR(255) - List에서 보여줄 이미지
// large_photo VARCHAR(255) - 상세 이미지
// stock INT DEFAULT 0 - 재고량
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
      timestamps: false, // 직접 created_at, updated_at 필드를 쓸 경우 false로
      underscored: false, // created_at → createdAt 매핑 피하려면 true
    });
  }

//   static associate(db) {
//     // 1. products.category_id → categories.product_id
//     db.Product.belongsTo(db.Category, {
//       foreignKey: 'category_id',
//       onDelete: 'CASCADE',
//     });

//     // 2. products.lineup_id → lineups.lineup_id
//     db.Product.belongsTo(db.Lineup, {
//       foreignKey: 'lineup_id',
//       onDelete: 'SET NULL',
//     });
//   }
}

module.exports = Product;