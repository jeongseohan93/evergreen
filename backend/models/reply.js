// backend/models/reply.js
const { Model, DataTypes } = require('sequelize');

class Reply extends Model {
  static initiate(sequelize) {
    return super.init({
      reply_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      board_id: { // 어떤 게시글의 댓글인지
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'board', // 참조하는 테이블 이름 (Board 모델의 tableName)
          key: 'board_id', // Board 모델의 primaryKey 컬럼
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      user_id: { // 누가 댓글을 작성했는지
        type: DataTypes.STRING(36),
        allowNull: false,
        references: {
          model: 'users', // 참조하는 테이블 이름 (User 모델의 tableName)
          key: 'user_uuid', // User 모델의 primaryKey 또는 고유 키 컬럼
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      content: { // 댓글 내용
        type: DataTypes.TEXT,
        allowNull: false,
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
    }, {
      sequelize,
      modelName: 'Reply',
      tableName: 'reply', // 테이블 이름은 'reply'로 설정
      timestamps: false, // created_at, updated_at을 수동으로 관리
      underscored: true, // 컬럼 이름이 스네이크 케이스 (board_id, user_id)
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
    // Reply는 하나의 Board에 속함 (N:1 관계)
    db.Reply.belongsTo(db.Board, {
      foreignKey: 'board_id',
      targetKey: 'board_id',
      as: 'Board',
      onDelete: 'CASCADE',
    });

    // Reply는 하나의 User에 속함 (N:1 관계)
    db.Reply.belongsTo(db.User, {
      foreignKey: 'user_id',
      targetKey: 'user_uuid',
      as: 'User', // 댓글 작성자 정보를 가져올 때 사용할 alias
      onDelete: 'CASCADE',
    });
  }
}

module.exports = Reply;
