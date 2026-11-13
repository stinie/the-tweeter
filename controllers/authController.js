/*
File: controllers/authController.js
Purpose: Handle registration, login and logout.
Registration saves the user with a hashed password.
Login creates a JWT cookie and redirects to /tweets.
Logout clears the cookie and redirects to /.
*/

/* ========================================
   1. IMPORTS
======================================== */

const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


/* ========================================
   2. REGISTER
======================================== */

// Register a new user.
const register = (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  // Trim names and email; preserve passwords exactly as entered.
  const cleanFirstName =
    typeof firstName === "string" ? firstName.trim() : "";
  const cleanLastName =
    typeof lastName === "string" ? lastName.trim() : "";
  const cleanEmail =
    typeof email === "string" ? email.trim().toLowerCase() : "";

  // Require all fields, including password confirmation.
  if (
    !cleanFirstName ||
    !cleanLastName ||
    !cleanEmail ||
    typeof password !== "string" ||
    !password ||
    typeof confirmPassword !== "string" ||
    !confirmPassword
  ) {
    return res.status(400).render("auth", {
      registered: false,
      error: "Please fill in all fields"
    });
  }

  // Display the password mismatch on the authentication page.
  if (password !== confirmPassword) {
    return res.status(400).render("auth", {
      registered: false,
      error: "Passwords do not match"
    });
  }

  // Hash the password and save the user.
  bcrypt.hash(password, 10)
    .then((hashedPassword) => {
      return User.create({
        firstName: cleanFirstName,
        lastName: cleanLastName,
        email: cleanEmail,
        password: hashedPassword
      });
    })
    .then(() => {
      res.redirect("/?registered=true");
    })
    .catch((err) => {
      // Handle an email address that is already registered.
      if (err.code === 11000) {
        // Display the error on the login and registration page.
        return res.status(409).render("auth", {
          registered: false,
          error: "Email is already registered"
        });
      }

      console.log(err);
      return res.status(500).render("auth", {
        registered: false,
        error: "Registration failed"
      });
    });
};



/* ========================================
   3. LOGIN
======================================== */

// Log in an existing user.
const login = (req, res) => {
  const { email, password } = req.body;

  // Check that both fields are filled in.
  if (!email || !password) {
    return res.status(400).render("auth", {
      registered: false,
      error: "Please fill in all fields"
    });
  }

  // Find the user by email.
  User.findOne({ email })
    .then((user) => {
      // Check whether the user exists.
      if (!user) {
        return res.status(401).render("auth", {
          registered: false,
          error: "Invalid email or password"
        });
      }

      // Compare the submitted password with the stored hash.
      return bcrypt.compare(password, user.password)
        .then((isMatch) => {
          if (!isMatch) {
            return res.status(401).render("auth", {
              registered: false,
              error: "Invalid email or password"
            });
          }

          // Password is correct.

          /* ========================================
             JWT & COOKIE
          ======================================== */

          // Create a signed JWT containing the user's ID.
          const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
          );

          // Store the JWT in an HTTP-only cookie.
          res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 1000
          });

          // Redirect to the tweets.
          res.redirect("/tweets");

        });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).render("auth", {
        registered: false,
        error: "Login failed"
      });
    });
};

/* ========================================
   5. LOGOUT
======================================== */

// Remove the authentication cookie and return home.
const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax"
  });

  res.redirect("/");
};

/* ========================================
   6. EXPORTS
======================================== */

module.exports = { register, login, logout };