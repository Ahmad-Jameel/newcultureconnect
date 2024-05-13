const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config");

const Comments = sequelize.define("comments", {
  CommenterName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
   Comment: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  PostId: {
    type: DataTypes.STRING,
  },
});

module.exports = Comments;

