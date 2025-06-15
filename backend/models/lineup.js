//line_up 시퀄라이즈 모델

//컬럼 설명
//name - 특정 브랜드 또는 제조업체가 생산하는 낚시대의 종류와 모델들을 모두 묶어 놓은 것을 의미
//lineup_id - 라인업 고유 아이디(중복허용 X)

const { Model, DataTypes } = require('sequelize');

class Lineup extends Model {
  static initiate(sequelize) {
    return super.init(
      {
        lineup_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'Lineup',
        tableName: 'line_up',
        timestamps: false,
        collate: 'utf8_general_ci',
      }
    );
  }

  /* static associate(db) {
    Lineup.hasMany(db.Product, { //하나의 라인업 안에 많은 상품들이 속해있다.
      foreignKey: 'lineup_id',
      onDelete: 'SET NULL',
    });
  } */
}

module.exports = Lineup;
