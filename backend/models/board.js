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
        type: DataTypes.CHAR(36),
        allowNull: false,
        primaryKey: true,
        collate: 'utf8_general_ci',
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
      name: {
        type: DataTypes.STRING(100),
      },
      notice: {
        type: DataTypes.ENUM('Y', 'N'),
        defaultValue: 'N',
      },
      enum: {
        type: DataTypes.ENUM('TYPE1', 'TYPE2'), // 실제 enum 값은 프로젝트에 맞게 수정 필요
      },
    }, {
      sequelize,
      modelName: 'Board',
      tableName: 'board',
      timestamps: false,
      underscored: true,
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
    db.Board.belongsTo(db.User, {
        foreignKey: 'user_id',
        //회원 한명의 삭제 => 그 회원이 작성한 모든 게시글 삭제
        onDelete: 'CASCADE', 
    });
  }
}

module.exports = Board;


