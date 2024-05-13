const sequelize = require("../config")
const { Sequelize, DataTypes } = require("sequelize");

const Native = sequelize.define("natives", {
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
    city:{
        type: DataTypes.STRING,
          allowNull: false
    },
    province:{
        type: DataTypes.STRING,
          allowNull: false
    },
    role:{
        type: DataTypes.STRING,
          allowNull: false
    },
    language:{
        type: DataTypes.STRING,
          allowNull: false
    },
    service:{
        type: DataTypes.STRING,
          allowNull: false
    },
    qualification:{
        type: DataTypes.STRING,
          allowNull: false
    },
    Feild_qualification:{
        type: DataTypes.STRING,
          allowNull: false
    },

    verificationCode: DataTypes.STRING,
    isVerified: DataTypes.BOOLEAN
 });

 module.exports = Native




