const sequelize = require("../config")
const { Sequelize, DataTypes } = require("sequelize");

const User = sequelize.define("users", {
  UserID: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    unique: true,
    allowNull: false
  },
  Name: {
    type: DataTypes.STRING,
    allowNull: false
  }, 
  FirstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    LastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    PhoneNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Cover_photo: {
      type: DataTypes.STRING,
    },
    Profile_pic: {
      type: DataTypes.STRING,
    },
    is_Online: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    role:{
      type: DataTypes.STRING,
        allowNull: false
    },
    verificationCode: DataTypes.STRING,
    isVerified: DataTypes.BOOLEAN
 });

 module.exports = User