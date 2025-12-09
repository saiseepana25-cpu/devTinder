const expresss = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = expresss.Router();
const connectionrequest = require("../models/connectionRequest");
const { User } = require("../models/user");
const User_Safe_Data = "firstName lastName about skills photoUrl";
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections = await connectionrequest
      .find({
        toUserId: loggedInUser._id,
        status: "intrested",
      })
      .populate("fromUserId", User_Safe_Data);
    if (!connections) {
      res.json({ message: "no connections found" });
    }
    res.json(connections);
  } catch (err) {
    res.status(404).send("Error " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections = await connectionrequest
      .find({
        $or: [
          { fromUserId: loggedInUser._id, status: "accepted" },
          { toUserId: loggedInUser._id, status: "accepted" },
        ],
      })
      .populate("fromUserId", User_Safe_Data)
      .populate("toUserId", User_Safe_Data);
    if (!connections) {
      res.json({ message: "no connections found" });
    }

    const data = connections.map((val) => {
      if (val.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return val.toUserId;
      }
      return val.fromUserId;
    });
    res.json({ data: data });
  } catch (err) {
    res.status(404).send("Error " + err.message);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;
    const connectionRequests = await connectionrequest
      .find({
        $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      })
      .select("fromUserId toUserId");
    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId);
      hideUsersFromFeed.add(req.toUserId);
    });
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(User_Safe_Data)
      .skip(skip)
      .limit(limit);
    res.json({ data: users });
  } catch (err) {
    res.status(404).send("Error " + err.message);
  }
});
module.exports = userRouter;
