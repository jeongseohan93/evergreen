// backend/models/board.js
const { Model, DataTypes } = require('sequelize');

class Board extends Model {
  static initiate(sequelize) {
    return super.init({
      board_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.UUID, // UUID 타입 사용
        allowNull: false,
        // 🚩 외래 키 제약 조건 명시 (이 부분이 없으면 FOREIGN KEY 에러 발생)
        references: {
          model: 'users', // 참조하는 테이블 이름 (User 모델의 tableName과 일치해야 함)
          key: 'user_uuid', // User 모델의 기본 키 컬럼 이름
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      reply: {
        type: DataTypes.TEXT,
      },
      like_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      hate_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      content: {
        type: DataTypes.JSON,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      title: {
        type: DataTypes.STRING(200),
      },
      // 🚩 name 필드 주석 해제 (모델에 포함)
      name: {
        type: DataTypes.STRING(100),
        allowNull: true, // 필요에 따라 변경 (사용자 이름이 없을 수도 있다면)
      },
      notice: {
        type: DataTypes.ENUM('Y', 'N'),
        defaultValue: 'N',
      },
      enum: {
        type: DataTypes.ENUM('review', 'free'),
        allowNull: false,
      },
    }, {
      sequelize,
      modelName: 'Board',
      tableName: 'board',
      timestamps: false,
      underscored: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
    db.Board.belongsTo(db.User, {
        foreignKey: 'user_id',
        targetKey: 'user_uuid',
        as: 'User', // 🚩 as: 'User' 명시 (include 할 때와 일치)
        onDelete: 'CASCADE',
    });
   // Board는 여러 개의 Reply를 가질 수 있음 (1:N 관계)
    db.Board.hasMany(db.Reply, {
      foreignKey: 'board_id',
      sourceKey: 'board_id',
      as: 'Replies', // 게시글 상세 조회 시 댓글 목록을 가져올 때 사용할 alias
      onDelete: 'CASCADE',
    });
  }
}

module.exports = Board;