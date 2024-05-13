const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config");

const User_Friend = sequelize.define("friends", {
  User_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Friend_Id:{
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Status:{
    type: DataTypes.ENUM('0', '1', '2', '3'),
    defaultValue: '0'
  }
});

module.exports = User_Friend;
