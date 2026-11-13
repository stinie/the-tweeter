
const jwt = require("jsonwebtoken");

/* ========================================
   1. REQUIRE AUTHENTICATION
======================================== */

// Check whether the browser has a login cookie.
const requireAuth = (req, res, next) => {
  const token = req.cookies.token;

  // No token? Return to the login page.
  if (!token) {
    return res.redirect("/");
  }

  // Verify the token using our secret.
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Make the user's ID available to the next handler.
    req.userId = decoded.userId;

    // Token is valid. Continue to the protected route.
    next();
  } catch (err) {
    // Invalid or expired token? Return to login.
    return res.redirect("/");
  }
};

/* ========================================
   2. EXPORT
======================================== */

module.exports = requireAuth;