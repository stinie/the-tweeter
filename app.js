/* ========================================
   1. ENVIRONMENT VARIABLES
======================================== */

// Load local environment variables from .env.
process.loadEnvFile();


/* ========================================
   2. IMPORTS
======================================== */

// Import Express.
const express = require("express");

// Import Morgan for HTTP request logging.
const morgan = require("morgan");

// Import cookie-parser to read cookies from incoming requests.
const cookieParser = require("cookie-parser");

// Import the database connection function.
const connectDB = require("./config/database");

// Import the authentication router.
const authRouter = require("./routes/authRouter");

// Import middleware to recognize login status.
const checkAuth = require("./middleware/checkAuth");

// Import the router that handles tweet requests.
const tweetRouter = require("./routes/tweetRouter");


/* ========================================
   3. EXPRESS APP
======================================== */

// Create the Express application.
const app = express();

// Use the environment port or default to 3000.
const PORT = process.env.PORT || 3000;


/* ========================================
   4. VIEW ENGINE
======================================== */

// Configure EJS as the template engine.
app.set("view engine", "ejs");


/* ========================================
   5. MIDDLEWARE
======================================== */

// Log incoming HTTP requests.
app.use(morgan("dev"));

// Parse form data and make it available in req.body.
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public folder.
app.use(express.static("public"));

// Parse incoming cookies and make them available in req.cookies.
app.use(cookieParser());

// Make login status available to all EJS views.
app.use(checkAuth);


/* ========================================
   6. ROUTES
======================================== */

// Handle authentication and homepage routes.
app.use("/", authRouter);

// Handle tweet routes.
app.use("/", tweetRouter);


/* ========================================
   7. DATABASE CONNECTION & SERVER
======================================== */

// Connect to MongoDB, then start the server.
connectDB()
   .then(() => app.listen(PORT))
   .catch((err) => console.log(err));