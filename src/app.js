const express = require("express");
const { connectDB } = require("./config/database");
const { User } = require("./models/user");
const app = express();

app.post("/signUp", async (req, res) => {
  const userObj = {
    firstName: "sachin",
    lastName: "tendulkar",
    email: "sachin@tendulkar.com",
    password: "sachin@123",
  };
  const user = new User(userObj);
  try {
    await user.save();
    res.send("user data saved successfully");
  } catch (err) {
    res.status(400).send("error while saving the data", err.message);
  }
});

connectDB()
  .then(() => {
    console.log("database connected successfully");
    app.listen(3000, () => console.log("listening on port 3000"));
  })
  .catch(() => {
    console.log("error while connecting it");
  });
