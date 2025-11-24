const express = require("express");
const { connectDB } = require("./config/database");
const { User } = require("./models/user");
const app = express();
app.use(express.json());

app.post("/signUp", async (req, res) => {
  const userData = req.body;
  const user = new User(userData);
  try {
    await user.save();
    res.send("user data saved successfully");
  } catch (err) {
    res.status(400).send("error while saving the data", err.message);
  }
});

app.get("/user", async (req, res) => {
  const emailId = req.body.email;
  try {
    const user = await User.find({ email: emailId });
    res.send(user);
  } catch (err) {
    res.status(400).send("something went wrong", err.message);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const user = await User.find({});
    res.send(user);
  } catch (err) {
    res.status(400).send("something went wrong", err.message);
  }
});

app.delete("/user", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete({ _id: req.body._id });
    res.send(user);
  } catch (err) {
    res.status(400).send("something went wrong", err.message);
  }
});

app.patch("/user", async (req, res) => {
  const userId = req.body.id;
  const userDetails = req.body;
  try {
    const user = await User.findByIdAndUpdate(userId, userDetails);
    res.send(user);
  } catch (err) {
    res.status(400).send("something went wrong", err.message);
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
