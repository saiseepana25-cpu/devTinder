const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["intrested", "ignored", "accepted", "rejected"],
        message: `{value} is incorrect`,
      },
    },
  },
  {
    timestamps: true,
  }
);

//cretaing index
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

//chck for same user cannot send request to himself
connectionRequestSchema.pre("save", function (next) {
  const connectionreq = this;
  if (connectionreq.fromUserId.equals(connectionreq.toUserId)) {
    throw new Error("you cannot send request to yourself");
  }
  next();
});

const ConnectionRequestModel = new mongoose.model(
  "connectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
