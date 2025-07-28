const { Model, DataTypes } = require('sequelize');

class Product extends Model {
  static initiate(sequelize) {
    return super.init({
      product_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      category_id: { // 2단계 카테고리 ID
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      lineup_id: { // 1단계 카테고리 ID
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      name: { // 상품명
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
      origin: {
        type: DataTypes.STRING(100), // 예: '대한민국', '중국', '일본' 등
        allowNull: true,
      },
      model_name: { // ⭐️ 기존 모델명 컬럼 (3단계 카테고리 아님)
        type: DataTypes.STRING(100), 
        allowNull: true,
      },
      // ⭐️ 3단계 카테고리 이름을 저장할 새로운 컬럼 추가
      sub2_category_name: { 
        type: DataTypes.STRING(100), 
        allowNull: true, // 3단계 카테고리가 없는 상품도 있을 수 있으므로
      },
      small_photo: {
        type: DataTypes.STRING(255),
      },
      large_photo: {
        type: DataTypes.STRING(255),
      },
      // ⭐️ 유튜브 링크를 저장할 youtube_url 컬럼 추가
      youtube_url: {
        type: DataTypes.STRING(500), // 유튜브 임베드 URL을 저장할 예정
        allowNull: true, // 유튜브 링크가 없는 상품도 있을 수 있으므로
      },
      stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      brand: {
        type: DataTypes.STRING(100),
      },
      pick: {
        type: DataTypes.ENUM(
          'nothing',
          'evergreen-recommend',
          'reel-recommend',
          'popular-products',
          'hard-bait',
          'soft-bait',
          'tackle-bag-small-items',
          'new-products',
          'restocked-products',
          'general-recommend'
        ),
        defaultValue: 'nothing',
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
  // Board와의 관계 추가
  static associate(db) {
    db.Product.hasMany(db.Board, {
      foreignKey: 'product_id',
      sourceKey: 'product_id',
      as: 'Boards',
      onDelete: 'CASCADE',
    });
  }
}

module.exports = Product;