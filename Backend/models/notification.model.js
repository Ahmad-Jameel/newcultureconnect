const sequelize = require("../config")
const { Sequelize, DataTypes } = require("sequelize");

const Notifications = sequelize.define("notifications", {
  Notification_Title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Notification_Description: {
    type: DataTypes.STRING,
    allowNull: false
  }, 
  Date: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Time: {
      type: DataTypes.STRING,
      allowNull: false
    },
    City: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Area: {
      type: DataTypes.STRING,
      allowNull: false
    },
    City: {
        type: DataTypes.STRING,
        allowNull: false
    },
    State: {
      type: DataTypes.STRING,
    },
    AddressNumber: {
      type: DataTypes.STRING,
    },
    open:{
      type: DataTypes.BOOLEAN,
      defaultValue: false

    }
 });

 module.exports = Notifications




