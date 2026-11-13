const mongoose = require("mongoose");

// Define each tweet and link it to its author.
const Tweet = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    minlength: [21, "Title must be longer than 20 characters"]
  },
  tweet: {
    type: String,
    required: [true, "Tweet is required"],
    trim: true,
    maxlength: [50, "Tweet must not exceed 50 characters"]
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Tweet", Tweet);