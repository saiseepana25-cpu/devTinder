const express = require("express");
const authRouter = express.Router();
const { validateSignupData } = require("../utils/validateSignup");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

authRouter.post("/signUp", async (req, res) => {
  try {
    validateSignupData(req);
    const { firstName, lastName, email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashPassword,
    });
    await user.save();
    res.send("user data saved successfully");
  } catch (err) {
    res.status(400).send("error while saving the data " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("in valid credientials");
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
      const token = await jwt.sign({ _id: user._id }, "DEV@tinder");
      res.cookie("token", token);
      res.send("login successful");
    } else {
      res.send("in valid credientials");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

authRouter.get("/logout", (req, res) => {
  res
    .cookie("token", null, {
      expire: new Date(Date.now()),
    })
    .send("user logged out successfully");
});
module.exports = authRouter;
