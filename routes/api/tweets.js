const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const Tweet = require("../../models/Tweet");
const validateTweetInput = require("../../validation/tweets");
const jwt = require("jsonwebtoken");

router.get("/", (req, res) => {
  Tweet.find()
    .sort({ date: -1 }) //sorts by date in reverse order
    .then((tweets) => res.json(tweets))
    .catch((err) => res.status(404).json({ notweetsfound: "No tweets found" }));
});

router.get("/user/:user_id", (req, res) => {
  Tweet.find({ user: req.params.user_id }) // find tweets by this user
    .then((tweets) => res.json(tweets))
    .catch((err) =>
      res.status(404).json({ notweetsfound: "No tweets found from that user" })
    );
});

router.get("/:id", (req, res) => {
  Tweet.findById(req.params.id)
    .then((tweet) => res.json(tweet)) // finds a specific tweet
    .catch((err) => res.status(404).json({ err }));
});

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateTweetInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newTweet = new Tweet({
      user: req.user.id,
      text: req.body.text,
    });

    newTweet.save().then((tweet) => res.json(tweet));
  }
);

module.exports = router;
