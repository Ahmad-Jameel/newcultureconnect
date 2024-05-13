const sequelize = require("../config")
const { Sequelize, DataTypes } = require("sequelize");

const NotificationsOpenOrNot = sequelize.define("NotificationsOpenOrNot", {
   UserEmail: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Notification_status: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  } 
  
})

module.exports = NotificationsOpenOrNot