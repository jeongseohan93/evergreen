const { Model, DataTypes } = require('sequelize');

class Report extends Model {
  //initiate 반환: index.js에서 modelModule.initiate(sequelize) 호출하기 위해
  static initiate(sequelize) {
    return super.init({
      report_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      admin_uuid: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        collate: 'utf8_general_ci',
      },
      title: {
        type: DataTypes.STRING(200),
        allowNull: false
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      photo: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    }, {
      sequelize,
      modelName: 'Report',
      tableName: 'reports',
      timestamps: false,
      underscored: true,
      collate: 'utf8_general_ci',
    });
  }
}

module.exports = Report;
