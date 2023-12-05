const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const notificationSchema = new mongoose.Schema(
  {
    recipient: [
      {
        type: ObjectId,
        Ref: "USER",
      },
    ],
    sender: {
      type: ObjectId,
      ref: "USER",
    },
    type: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

mongoose.model("NOTIFICATION", notificationSchema);
