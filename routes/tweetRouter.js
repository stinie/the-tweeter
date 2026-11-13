const express = require("express");
const tweetController = require("../controllers/tweetController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// Require login before displaying the add-tweet form.
router.get("/addTweet", requireAuth, tweetController.showAddTweet);

// Require login before saving a new tweet.
router.post("/addTweet", requireAuth, tweetController.createTweet);

// Require login before displaying the tweet list.
router.get("/tweets", requireAuth, tweetController.listTweets);

// Require login before displaying one tweet.
router.get("/tweets/:id", requireAuth, tweetController.showTweet);

// Require login before deleting a tweet.
router.post("/tweets/:id/delete", requireAuth, tweetController.deleteTweet);

// Require login before displaying the editing form.
router.get("/tweets/edit/:id", requireAuth, tweetController.showEditTweet);

// Require login before saving changes to a tweet.
router.post("/tweets/edit/:id", requireAuth, tweetController.updateTweet);

module.exports = router;