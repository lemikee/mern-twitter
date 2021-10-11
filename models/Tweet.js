const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TweetSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId, // type will be user objectId
    ref: "users", // --> reference is name of the model that we want to associate with <---
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Tweet = mongoose.model("tweet", TweetSchema);
module.exports = Tweet;
