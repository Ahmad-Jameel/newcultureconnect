const sequelize = require("../config")
const { Sequelize, DataTypes } = require("sequelize");

const Reports = sequelize.define("Reports", {
  Reported_Post_ID: {
    type: DataTypes.STRING,
    allowNull:false
  },
  Reporttitle :{
    type: DataTypes.STRING,
    allowNull:false
  },
  postType:{
    type: DataTypes.STRING,
    allowNull:false
  },
  Reporter_email:{
    type:DataTypes.STRING,
    allowNull: false
  },
  reportjustification:{
    type: DataTypes.STRING(2000),
    allowNull: false
  },
  queryanswer:{
    type : DataTypes.STRING(2000),
  },
  reportstatus: {
    type: DataTypes.BOOLEAN,
    defaultValue: false 
  }
  

});

module.exports = Reports;