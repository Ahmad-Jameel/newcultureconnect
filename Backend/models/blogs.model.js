const sequelize = require("../config")
const { Sequelize, DataTypes } = require("sequelize");

const Blogs = sequelize.define("Blogs", {
  UserID: {
    type: DataTypes.STRING,
    allowNull:false
  },
  Blog_Title:{
    type:DataTypes.STRING,
    allowNull: false
  },
  Blog_Content:{
    type: DataTypes.STRING(2000),
    allowNull: false
  },
  Blog_Content_Image:{
    type:DataTypes.STRING,
    allowNull: false
  },
  Blog_Title_Image:{
    type:DataTypes.STRING,
    allowNull: false
  },
  BlogsID: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    unique: true,
    allowNull: false
  },

});

module.exports = Blogs;