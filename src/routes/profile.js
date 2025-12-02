const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const validateEditProfileData = require("../utils/validateEditProfileData");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Error while updating the data");
    }
    const loggedInUser = req.user;
    const updatedFields = req.body;
    Object.keys(updatedFields).forEach(
      (val) => (loggedInUser[val] = updatedFields[val])
    );

    await loggedInUser.save();
    res.json({
      message: loggedInUser.firstName + "user saved successfully",
      json: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = profileRouter;
