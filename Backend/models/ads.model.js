// const { Sequelize, DataTypes } = require("sequelize");
// const sequelize = require("../config");

// const Ads = sequelize.define("ads", {
//   AdsTitle: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   AdsGif: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   Ad_Duration: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
// });

// module.exports = Ads;


const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config");

const Ads = sequelize.define("ads", {
  AdsTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  AdsGif: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Ad_Duration: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  StartDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
  ExpiryDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

module.exports = Ads;
