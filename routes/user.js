const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const POST = mongoose.model("POST");
const USER = mongoose.model("USER");
const NOTIFICATIONS = mongoose.model("NOTIFICATION");

// to get user profiles and all the posts and saved posts
router.get("/user/:id", (req, res) => {
  USER.findOne({ _id: req.params.id })
    .select("-password")
    .then((user) => {
      POST.find({ postedBy: req.params.id })
        .populate("postedBy", "_id name photo")
        .populate("comments", "likes")
        .populate("comments.postedBy", "_id name comment")
        .exec()
        .then((post) => {
          POST.find({ _id: { $in: user.saved } })
            .populate("postedBy", "_id name photo")
            .populate("comments", "likes")
            .populate("comments.postedBy", "_id name comment")
            .exec()
            .then((savedPost) => {
              if (!post && !savedPost) {
                return res.status(422).json({ error: err });
              }
              res.status(200).json({ user, post, savedPost });
            })
            .catch((err) => {
              return res.status(404).json({ error: "Saved posts not found" });
            });
        })
        .catch((err) => {
          return res.status(404).json({ error: "User posts not found" });
        });
    })
    .catch((err) => {
      return res.status(404).json({ error: "User not found" });
    });
});
//to get all the notification fot he user
router.get("/allnotifications", requireLogin, (req, res) => {
  NOTIFICATIONS.find({ recipient: req.user._id })
    .populate("sender", "_id photo userName")
    .sort("-createdAt")
    .exec()
    .then((notification) => {
      if (!notification) {
        return res.status(422).json({ error: err });
      }
      res.status(200).json(notification);
    })
    .catch((err) => {
      return res.status(404).json({ error: err });
    });
});
//to delete all the notifications at once
router.put("/deletenotifications", requireLogin, async (req, res) => {
  try {
    const updatedNotifications = await NOTIFICATIONS.updateMany(
      {
        recipient: req.user._id,
      },
      {
        $pull: { recipient: req.user._id },
      },
      {
        new: true,
      }
    );

    res.json({ updatedNotifications });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
//to get the recommendations the people user don't follow
router.get("/recommendations", requireLogin, (req, res) => {
  USER.find({ _id: { $nin: [...req.user.following, req.user._id] } })
    .populate("followers", "_id photo userName name followers following")
    .then((users) => res.json(users))
    .catch((err) => console.log(err));
});

// to follow users
router.put("/follow", requireLogin, async (req, res) => {
  try {
    // Update the user being followed
    const followedUser = await USER.findByIdAndUpdate(
      req.body.followId,
      {
        $push: { followers: req.user._id },
      },
      {
        new: true,
      }
    );

    // Update the current user's following list
    const currentUser = await USER.findByIdAndUpdate(
      req.user._id,
      {
        $push: { following: req.body.followId },
      },
      {
        new: true,
      }
    );
    const notification = new NOTIFICATIONS({
      recipient: req.body.followId,
      sender: req.user._id,
      type: "followed",
    });
    notification.save();
    res.json({ followedUser, currentUser, notification });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// to unfollow user
router.put("/unfollow", requireLogin, async (req, res) => {
  try {
    // console.log(req.body);

    // Update the user being followed
    const followedUser = await USER.findByIdAndUpdate(
      req.body.unfollowId,
      {
        $pull: { followers: req.user._id },
      },
      {
        new: true,
      }
    );

    // Update the current user's following list
    const currentUser = await USER.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { following: req.body.unfollowId },
      },
      {
        new: true,
      }
    );

    res.json({ followedUser, currentUser });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
//to save a particular post once
router.put("/savepost", requireLogin, async (req, res) => {
  try {
    const savedPost = await USER.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: { saved: req.body.postId },
      },
      {
        new: true,
      }
    );

    res.json({ savedPost });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
//change.upload a profile pic
router.put("/uploadProfilePic", requireLogin, async (req, res) => {
  try {
    // Update the user being followed
    const userProfile = await USER.findByIdAndUpdate(
      req.user._id,
      {
        $set: { photo: req.body.pic },
      },
      {
        new: true,
      }
    );
    res.json({ userProfile });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
//to upload profileInfo
router.put("/uploadProfileInfo", requireLogin, async (req, res) => {
  try {
    // Update the user being followed
    const userProfile = await USER.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          name: req.body.name,
          mobile: req.body.mobile,
          address: req.body.address,
          website: req.body.website,
          bio: req.body.bio,
          gender: req.body.gender,
        },
      },
      {
        new: true,
      }
    );
    res.json({ userProfile });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
