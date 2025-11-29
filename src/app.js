const express = require("express");
const { connectDB } = require("./config/database");
const { User } = require("./models/user");
const { validateSignupData } = require("./utils/validateSignup");
const { userAuth } = require("./middlewares/auth");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const app = express();
app.use(express.json());
app.use(cookieParser());

app.post("/signUp", async (req, res) => {
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

app.post("/login", async (req, res) => {
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

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user.firstName + " sent you a connection request");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("database connected successfully");
    app.listen(3000, () => console.log("listening on port 3000"));
  })
  .catch(() => {
    console.log("error while connecting DB!");
  });
