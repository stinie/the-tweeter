
const jwt = require("jsonwebtoken");
const User = require("../models/user");

/* ========================================
   1. CHECK AUTHENTICATION
======================================== */

// Identify the user and share login details with EJS views.
const checkAuth = (req, res, next) => {
  // Default: visitor is logged out.
  req.userId = null;
  res.locals.isLoggedIn = false;
  res.locals.currentUser = null;

  const token = req.cookies.token;

  if (!token) {
    return next();
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    // Invalid or expired token: continue as a guest.
    return next();
  }

  // Check the ID before querying the database.
  if (
    typeof decoded.userId !== "string" ||
    !/^[a-fA-F0-9]{24}$/.test(decoded.userId)
  ) {
    return next();
  }

  // Find the account belonging to the verified token.
  return User.findById(decoded.userId)
    .select("_id firstName lastName")
    .then((user) => {
      if (user) {
        req.userId = user._id;
        res.locals.isLoggedIn = true;
        res.locals.currentUser = user;
      }

      // Continue only after the user lookup finishes.
      return next();
    })
    .catch(next);
};

/* ========================================
   2. EXPORT
======================================== */

module.exports = checkAuth;