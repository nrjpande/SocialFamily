const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      default:
        "https://upload.wikimedia.org/wikipedia/commons/5/50/User_icon-cp.svg",
    },
    password: {
      type: String,
      required: true,
    },
    followers: [
      {
        type: ObjectId,
        ref: "USER",
      },
    ],
    following: [
      {
        type: ObjectId,
        ref: "USER",
      },
    ],
    role: {
      type: String,
      default: "user",
    },
    gender: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
    },
    saved: [
      {
        type: ObjectId,
        ref: "POST",
      },
    ],
  },
  { timestamps: true }
);

mongoose.model("USER", userSchema);
