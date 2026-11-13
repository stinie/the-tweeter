
/* ========================================
   1. IMPORTS
======================================== */

const express = require("express");
const authController = require("../controllers/authController");
// Import middleware to protect private routes.
const requireAuth = require("../middleware/requireAuth");


/* ========================================
   2. ROUTER
======================================== */

const router = express.Router();


/* ========================================
   3. PUBLIC ROUTES
======================================== */

// Show authentication forms to guests; send logged-in users to tweets.
router.get("/", (req, res) => {
  if (res.locals.isLoggedIn) {
    return res.redirect("/tweets");
  }

  return res.render("auth", {
    registered: req.query.registered === "true"
  });
});


// Register a new user.
router.post("/auth/register", authController.register);

// Process the login form.
router.post("/auth/login", authController.login);


/* ========================================
   4. PROTECTED ROUTES
======================================== */


// Log out by clearing the authentication cookie.
router.post("/auth/logout", requireAuth, authController.logout);


/* ========================================
   5. EXPORT
======================================== */

module.exports = router;