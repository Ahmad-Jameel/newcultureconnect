const sequelize = require("../config")
const { Sequelize, DataTypes } = require("sequelize");

const CardPayment = sequelize.define("Cardpayment", {
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
        type: DataTypes.INTEGER,
        allowNull: false
    },
    isVerified:{type: DataTypes.BOOLEAN,
        defaultValue: false
    }
 });

 module.exports = CardPayment