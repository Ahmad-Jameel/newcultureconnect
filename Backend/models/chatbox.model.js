const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config");

// Create table with fields
const Chatbox = sequelize.define("chatbox", {
  sender_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Receiver_Id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.STRING,
  },
  unread: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

module.exports = Chatbox;
