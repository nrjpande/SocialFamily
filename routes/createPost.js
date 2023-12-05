const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const POST = mongoose.model("POST");
const NOTIFICATIONS = mongoose.model("NOTIFICATION");

//Route to get all the posts from followers and self
router.get("/allPosts", requireLogin, (req, res) => {
  POST.find({ postedBy: { $in: [...req.user.followers, req.user._id] } })
    .populate("postedBy", "_id name photo userName")
    .populate("comments.postedBy", "_id name photo userName")
    .sort("-createdAt")
    .then((posts) => res.json(posts))
    .catch((err) => console.log(err));
});

//Route to get all the posts from the followers only
router.get("/myfollowingpost", requireLogin, (req, res) => {
  POST.find({ postedBy: { $in: req.user.followers } })
    .populate("postedBy", "_id name photo userName")
    .populate("comments.postedBy", "_id name photo userName")
    .sort("-createdAt")
    .then((posts) => res.json(posts))
    .catch((err) => console.log(err));
});

//API to create a new post
router.post("/createPost", requireLogin, (req, res) => {
  const { body, pic } = req.body;

  if (!pic && !body) {
    return res.status(422).json({ error: "Please add all the fields." });
  } else {
    req.user;
    const post = new POST({
      body,
      photo: pic,
      postedBy: req.user,
    });

    const notification = new NOTIFICATIONS({
      recipient: req.user.following,
      sender: req.user._id,
      type: "posted",
    });

    notification.save();

    post
      .save()
      .then((result) => {
        return res.json({ post: result, notification: notification });
      })
      .catch((err) => {
        console.log(err);
      });
  }
});
//route to update a post
router.put("/updatePost/:postId", requireLogin, (req, res) => {
  const { body, photo } = req.body;
  const postId = req.params.postId;
  if (!photo && !body) {
    return res.status(422).json({ error: "Please update at least one field" });
  }

  POST.findOneAndUpdate(
    { _id: postId, postedBy: req.user._id },
    { $set: { body, photo, createdAt: new Date() } },
    { new: true }
  )
    .then((updatedPost) => {
      if (!updatedPost) {
        return res
          .status(404)
          .json({ error: "Post not found or unauthorized to update" });
      }

      res.json({ post: updatedPost });
    })
    .catch((err) => {
      res.status(500).json({ error: "Internal server error" });
    });
});

//API to get all the posts posted by user and saved by user
router.get("/myPosts", requireLogin, (req, res) => {
  POST.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name photo")
    .populate("comments.postedBy", "_id name")
    .sort("-createdAt")
    .then((myposts) => {
      res.json(myposts);
    });
});
// API to like a post
router.put("/like", requireLogin, (req, res) => {
  POST.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
    .exec()
    .then((result) => {
      if (!result) {
        return res.status(404).json({ error: "Post not found" });
      }
      const notification = new NOTIFICATIONS({
        recipient: result.postedBy._id,
        sender: req.user._id,
        type: "liked",
      });

      notification.save();

      res.json({ response: result, notification: notification });
    })
    .catch((err) => {
      res.status(422).json({ error: err.message });
    });
});
// API to unlike a post
router.put("/unlike", requireLogin, (req, res) => {
  POST.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
    .exec()
    .then((result) => {
      if (!result) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.json(result);
    })
    .catch((err) => {
      res.status(422).json({ error: err.message });
    });
});
// API to like a comment
router.put("/likeComment", requireLogin, async (req, res) => {
  try {
    const post = await POST.findOneAndUpdate(
      { "comments._id": req.body.commentId }, // Find the post that contains the comment with the given commentId
      {
        $push: { "comments.$.likes": req.user._id }, // Push user._id into the likes array of the matching comment
      },
      {
        new: true,
      }
    );

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json({ response: post });
  } catch (err) {
    res.status(422).json({ error: err.message });
  }
});
// API to unlike a comment
router.put("/unlikeComment", requireLogin, async (req, res) => {
  try {
    const post = await POST.findOneAndUpdate(
      { "comments._id": req.body.commentId },
      {
        $pull: { "comments.$.likes": req.user._id },
      },
      {
        new: true,
      }
    );

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json({ response: post });
  } catch (err) {
    res.status(422).json({ error: err.message });
  }
});

//API to post a comment on a post
router.put("/comment", requireLogin, (req, res) => {
  const comment = { comment: req.body.text, postedBy: req.user._id };
  POST.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec()
    .then((result) => {
      if (!result) {
        return res.status(404).json({ error: "Post not found" });
      }
      const notification = new NOTIFICATIONS({
        recipient: result.postedBy._id,
        sender: req.user._id,
        type: "commented",
      });

      notification.save();
      res.json({ response: result, notification: notification });
    })
    .catch((err) => {
      res.status(422).json({ error: err.message });
    });
});

// API to delete post
router.delete("/deletePost/:postId", requireLogin, (req, res) => {
  POST.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id userName photo")
    .exec()
    .then((post) => {
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      if (post.postedBy._id.toString() === req.user._id.toString()) {
        POST.findByIdAndRemove(req.params.postId)
          .exec()
          .then((result) => {
            return res.json({ message: "Successfully deleted" });
          })
          .catch((err) => {
            res.status(422).json({ error: err.message });
          });
      } else {
        return res
          .status(403)
          .json({ error: "Unauthorized to delete this post" });
      }
    })
    .catch((err) => {
      res.status(422).json({ error: err.message });
    });
});

module.exports = router;
