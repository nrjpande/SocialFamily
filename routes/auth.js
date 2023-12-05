const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const USER = mongoose.model("USER");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Jwt_secret } = require("../keys");


//If a new user signup
router.post("/signup", (req, res) => {
  const { name, userName, email, password, gender } = req.body;

  if (!name || !userName || !email || !password || !gender) {
    return res.status(422).json({ message: "please add all the fields" });
  }

  USER.findOne({ $or: [{ email: email }, { userName: userName }] }).then(
    (savedUser) => {
      if (savedUser) {
        return res.status(422).json({
          error: "User already registerd with that email or UserName",
        });
      }
      bcrypt.hash(password, 12).then((hashedPassword) => {
        const user = new USER({
          name,
          email,
          userName,
          password: hashedPassword,
          gender,
        });

        user
          .save()
          .then((user) => {
            res.json({ message: "Registered successfully" });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    }
  );
});
//existing user signIn
router.post("/SignIn", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({
      error: "Please add email and password",
    });
  }
  USER.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: "Invalid email" });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((match) => {
        if (match) {
          const token = jwt.sign({ _id: savedUser.id }, Jwt_secret);
          const { _id, name, email, userName, photo } = savedUser;
          res.json({ token, user: { _id, name, email, userName, photo } });
          // console.log({ token, user: { _id, name, email, userName } });
        } else {
          return res.status(422).json({
            error: "Invalid Password",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

module.exports = router;
