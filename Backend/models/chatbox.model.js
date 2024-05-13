const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config");

//------create table with feilds--------
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
});

module.exports = Chatbox;
