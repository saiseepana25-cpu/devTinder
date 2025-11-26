const express = require("express");
const { connectDB } = require("./config/database");
const { User } = require("./models/user");
const { validateSignupData } = require("./utils/validateSignup");
const bcrypt = require("bcrypt");
const app = express();
app.use(express.json());

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
    if (!validPassword) {
      throw new Error("in valid credientials");
    } else {
      res.send("user logged in successfully");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

app.get("/user", async (req, res) => {
  const emailId = req.body.email;
  try {
    const user = await User.find({ email: emailId });
    res.send(user);
  } catch (err) {
    res.status(400).send("something went wrong " + err.message);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const user = await User.find({});
    res.send(user);
  } catch (err) {
    res.status(400).send("something went wrong " + err.message);
  }
});

app.delete("/user", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete({ _id: req.body._id });
    res.send(user);
  } catch (err) {
    res.status(400).send("something went wrong " + err.message);
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const userDetails = req.body;
  console.log(Object.keys(userDetails));
  try {
    const allowedUpdates = [
      "firstName",
      "lastName",
      "password",
      "gender",
      "about",
      "photoUrl",
      "skills",
    ];
    const isAllowed = Object.keys(userDetails).every((k) =>
      allowedUpdates.includes(k)
    );
    if (!isAllowed) {
      throw new Error("data not updated");
    }
    const user = await User.findByIdAndUpdate(userId, userDetails, {
      runValidators: true,
    });
    res.send(user);
  } catch (err) {
    res.status(400).send("something went wrong " + err.message);
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
