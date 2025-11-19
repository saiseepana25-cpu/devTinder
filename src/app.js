const express = require("express");

const app = express();

const { adminAuth, userAuth } = require("./middlewares/auth");

app.use("/admin", adminAuth);

app.get("/user", userAuth, (re, res) => {
  res.send("use data sent successfully");
});

app.get("/admin/getData", (req, res) => {
  res.send("sent user data");
});

app.get("/admin/deleteUser", (req, res) => {
  res.send("deleting user");
});

app.listen(3000, () => console.log("listening on port 3000"));
