const sequelize = require("../config");
const { Sequelize, DataTypes } = require("sequelize");

const Report = sequelize.define("reports", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    unique: true,
    allowNull: false,
    primaryKey: true,
  },
  nativeId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  reporterId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

module.exports = Report;