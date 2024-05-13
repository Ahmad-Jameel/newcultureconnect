const sequelize = require("../config")
const { Sequelize, DataTypes } = require("sequelize");

const Payment = sequelize.define("payment", {
  UserID: {
    type: DataTypes.STRING,
  },
  ChatID:{
    type: DataTypes.STRING,
  },
    Email: {
      type: DataTypes.STRING,
    },
    Amount: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Last_four_digit_of_account: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Payment_Pic: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Payment_Method: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Date: {
      type: DataTypes.STRING,
      allowNull: false

    },
    Time:{
      type: DataTypes.STRING,
        allowNull: false
    },

    isVerified:{type: DataTypes.BOOLEAN,
        defaultValue: false
    }
 });

 module.exports = Payment