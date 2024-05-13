const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config");

//------create table with feilds--------
const Image = sequelize.define("imagePost", {
    picture:{
        type: DataTypes.STRING
      },
      UserID:{
        type:DataTypes.STRING,
        allowNull: false
      },
      img_caption:{
        type:DataTypes.STRING
      },
      ImageID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        allowNull: false
      },
});

module.exports = Image;
