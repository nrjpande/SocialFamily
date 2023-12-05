const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const postSchema = new mongoose.Schema(
  {
    body: {
      type: String,
    },
    photo: {
      type: String,
    },
    likes: [{ type: ObjectId, ref: "USER" }],

    comments: [
      {
        comment: { type: String },
        postedBy: { type: ObjectId, ref: "USER" },
        createdAt: { type: Date, default: Date.now() },
        likes: [{ type: ObjectId }],
        replies: [
          {
            reply: { type: String },
            postedBy: { type: ObjectId, ref: "USER" },
            createdAt: { type: Date, default: Date.now() },
          },
        ],
      },
    ],
    postedBy: {
      type: ObjectId,
      ref: "USER",
    },
  },
  { timestamps: true }
);

mongoose.model("POST", postSchema);
