const express = require("express");

const app = express();

app.use("/test", (req, res) => {
  res.send("testing on port 3000");
});

app.use("/", (req, res) => {
  res.send("hello hello hello");
});

app.listen(3000, () => console.log("listening on port 3000"));
