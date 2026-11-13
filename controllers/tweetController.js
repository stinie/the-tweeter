/*
File: controllers/tweetController.js
Purpose: List, display, create, edit and delete tweets.
Render the tweet pages and their forms.
Use the Tweet model to retrieve, validate and save data.
After creating, updating or deleting, redirect to /tweets.
Authentication is checked by requireAuth in the router.
*/

/* ========================================
   1. IMPORTS
======================================== */

const Tweet = require("../models/TweetSchema");


/* ========================================
   2. LIST TWEETS
======================================== */

// Retrieve all tweets, newest first, and display the list.
const listTweets = (req, res) => {
  Tweet.find()
    .sort({ createdAt: -1 })
    .then((tweets) => {
      res.render("tweets", { tweets });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).render("error", {
        error: "Could not load tweets"
      });
    });
};


/* ========================================
   3. SHOW ADD TWEET FORM
======================================== */

// Display the form for adding a tweet.
const showAddTweet = (req, res) => {
  res.render("addTweet");
};


/* ========================================
   4. CREATE TWEET
======================================== */

// Create a tweet belonging to the authenticated user.
const createTweet = (req, res) => {
  const { title, tweet } = req.body;

  // Model validation checks required fields and text lengths.
  Tweet.create({
    title,
    tweet,
    userId: req.userId
  })
    .then(() => {
      res.redirect("/tweets");
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        const message = Object.values(err.errors)
          .map((error) => error.message)
          .join(". ");

        // Show validation errors on the add-tweet page.
        return res.status(422).render("addTweet", {
          error: message
        });
      }

      console.log(err);
      return res.status(500).render("error", {
        error: "Could not create tweet"
      });
    });
};


/* ========================================
   5. SHOW ONE TWEET
======================================== */

// Find one tweet and display its detail page.
const showTweet = (req, res) => {
  const tweetId = req.params.id;

  // Reject invalid IDs before querying the database.
  if (!/^[a-fA-F0-9]{24}$/.test(tweetId)) {
    return res.status(404).render("error", {
      error: "Tweet not found"
    });
  }

  Tweet.findById(tweetId)
    .then((tweet) => {
      if (!tweet) {
        return res.status(404).render("error", {
          error: "Tweet not found"
        });
      }

      res.render("showTweet", { tweet });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).render("error", {
        error: "Could not load tweet"
      });
    });
};


/* ========================================
   6. DELETE TWEET
======================================== */

// Delete a tweet and return to the tweet list.
const deleteTweet = (req, res) => {
  const tweetId = req.params.id;

  // Reject invalid IDs before querying the database.
  if (!/^[a-fA-F0-9]{24}$/.test(tweetId)) {
    return res.status(404).render("error", {
      error: "Tweet not found"
    });
  }

  // Delete only a tweet belonging to the logged-in user.
  Tweet.findOneAndDelete({
    _id: tweetId,
    userId: req.userId
  })
    .then((tweet) => {
      if (!tweet) {
        return res.status(404).render("error", {
          error: "Tweet not found"
        });
      }

      return res.redirect("/tweets");
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).render("error", {
        error: "Could not delete tweet"
      });
    });
};


/* ========================================
   7. SHOW EDIT TWEET FORM
======================================== */

// Find the tweet and display its editing form.
const showEditTweet = (req, res) => {
  const tweetId = req.params.id;

  // Reject invalid IDs before querying the database.
  if (!/^[a-fA-F0-9]{24}$/.test(tweetId)) {
    return res.status(404).render("error", {
      error: "Tweet not found"
    });
  }

  // Find only a tweet belonging to the logged-in user.
  Tweet.findOne({
    _id: tweetId,
    userId: req.userId
  })
    .then((tweet) => {
      if (!tweet) {
        return res.status(404).render("error", {
          error: "Tweet not found"
        });
      }

      return res.render("editTweet", { tweet });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).render("error", {
        error: "Could not load the editing form"
      });
    });
};


/* ========================================
   8. UPDATE TWEET
======================================== */


// Validate and save changes, then return to the tweet list.
const updateTweet = (req, res) => {
  const tweetId = req.params.id;
  const { title, tweet } = req.body;

  // Reject invalid IDs before querying the database.
  if (!/^[a-fA-F0-9]{24}$/.test(tweetId)) {
    return res.status(404).render("error", {
      error: "Tweet not found"
    });
  }

  // Find only a tweet belonging to the logged-in user.
  Tweet.findOne({
    _id: tweetId,
    userId: req.userId
  })
    .then((existingTweet) => {
      if (!existingTweet) {
        return res.status(404).render("error", {
          error: "Tweet not found"
        });
      }

      // Update only the editable fields.
      existingTweet.title = title;
      existingTweet.tweet = tweet;

      // Saving runs the schema's required and length checks.
      return existingTweet.save().then(() => {
        return res.redirect("/tweets");
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        const message = Object.values(err.errors)
          .map((error) => error.message)
          .join(". ");

        // Keep the submitted values on the editing page.
        return res.status(422).render("editTweet", {
          error: message,
          tweet: {
            _id: tweetId,
            title,
            tweet
          }
        });
      }

      console.log(err);
      return res.status(500).render("error", {
        error: "Could not update tweet"
      });
    });
};


/* ========================================
   9. EXPORTS
======================================== */

module.exports = {
  listTweets,
  showAddTweet,
  createTweet,
  showTweet,
  deleteTweet,
  showEditTweet,
  updateTweet
};