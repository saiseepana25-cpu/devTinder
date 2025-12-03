const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const connectionRequest = require("../models/connectionRequest");
const { User } = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      //check for only allowed status
      const allowed_status = ["ignored", "intrested"];
      if (!allowed_status.includes(status)) {
        return res.status(400).json({ message: `invalid status type` });
      }
      const toUser = await User.findById(toUserId);

      //check for user is there or not
      if (!toUser) {
        return res.status(400).json({ message: `user not found` });
      }

      //check for existing connectin in db
      const existingConnectionRequest = await connectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res.status(400).json({ message: `user already exists` });
      }

      const connectionRequestData = new connectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      await connectionRequestData.save();
      res.json({
        message: req.user.firstName + status + " in " + toUser.firstName,
      });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

module.exports = requestRouter;
