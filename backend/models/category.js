//category 시퀄라이즈 모델
//product 테이블과 category_id컬럼을 외래키로 연결됨

//컬럼 설명
//name - 릴, 로드, 라인, 훅 등 낚시대 부분부분들 이름
//category_id - 카테고리 고유 아이디(중복허용 X)

const { Model, DataTypes } = require('sequelize');

class Category extends Model {
  static initiate(sequelize) {
    return super.init(
      {
        category_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        parent_category_id: {
          type: DataTypes.INTEGER,
          allowNull: true, 
        },
      },
      
      {
        sequelize,
        modelName: 'Category',
        tableName: 'category',
        timestamps: false, //일단 기본적으로 created_at, updated_at 필드는 끈 상태로 진행
        collate: 'utf8_general_ci',
      }
    );
  }

  /* static associate(db) { //테이블 관계성 설정
    //belongsTo와 hasMany는 쌍방향 관계를 완성하기 위해 둘 다 필요하다.(product.js / category.js)
    Category.hasMany(db.Product, { //하나의 카테고리 안에 많은 상품들이 속해있다.
      foreignKey: 'category_id',
      onDelete: 'CASCADE',
    });
  } */
}

module.exports = Category;