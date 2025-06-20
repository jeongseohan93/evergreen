// sale_date - DATE타입. 2024-01-01 형식으로 일별로 저장. (중복 허용 X)
// 나중에 admin페이지에서 연/월/일 별로 옵션 선택해서 조회할 수 있도록 추가.

// online_amount - 온라인 매출.(해당 일 기준)
// offline_amount - 오프라인 매출.
// cancel_amount - 취소된 매출.
// total_amount - 총 매출.
// memo - 메모(?)

//order테이블과 연결 일단은 안 함. 
//컬럼들에 allowNull: true 설정 부여해서 집계안된 데이터들은 NULL로 처리.

const { Model, DataTypes } = require('sequelize');

class Sale extends Model {
  static initiate(sequelize) {
    return super.init({
      sale_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      sale_date: {
        type: DataTypes.CHAR(10), // YYYY-MM-DD 형식
        allowNull: false,
      },
      online_amount: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      offline_amount: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      cancel_amount: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      total_amount: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      memo: {
        type: DataTypes.TEXT,
        allowNull: true,
      }
    }, {
      sequelize,
      modelName: 'Sale',
      tableName: 'sales',
      timestamps: false,
      underscored: true,
      collate: 'utf8_general_ci',
    });
  }
}

module.exports = Sale;
