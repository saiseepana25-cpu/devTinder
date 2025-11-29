const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("token not found");
    }
    const decodedData = await jwt.verify(token, "DEV@tinder");
    const id = decodedData._id;
    const user = await User.findOne({ _id: id });
    if (!user) {
      throw new Error("user is not valid");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};

module.exports = { userAuth };
