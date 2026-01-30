const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://devTinder:saiseepana123@cluster0.x8o6hzi.mongodb.net/?appName=Cluster0",
    {
      dbName: "devTinder",
    },
  );
};

module.exports = { connectDB };
