const user = require("../models/user.model");
const native = require("../models/native.model");
const { Op } = require("sequelize");


const checkDuplicate = async (req, res, next) => {
  try {
    // Check for duplicates in both models in parallel
    const [userResult, nativeResult] = await Promise.all([
      user.findOne({
        where: {
            [Op.or]: [{ Name: req.body.name }, { Email: req.body.email }]
        }
    }),
    native.findOne({
        where: {
            [Op.or]: [{ Name: req.body.name }, { Email: req.body.email }]
        }
    }),
    ]);

    // If either result exists, send an error response
    if (userResult || nativeResult) {
      return res.status(400).send({ message: "User already exists" });
    }

    // If no duplicates, proceed to next middleware
    next();
  } catch (error) {
    // Handle any errors that occurred during the operation
    res.status(500).send({ message: "Error checking for duplicates" });
  }
};

module.exports = checkDuplicate






// const checkDuplicate = (req, res, next) => {
//   user.findOne({
//     where: {
//         Name: req.body.name
//     }
//   }).then(rs => {
//     if (rs) {
//       res.status(400).send({message: "User already exist"});
//       return;
//     }
//     user.findOne({
//       where: {
//         Email: req.body.email
//       }
//     }).then(rs => {
//       if (rs) {
//         res.status(400).send({message: "User already exist"});
//         return;
//       }

//       next();
//     });
//   });
// };