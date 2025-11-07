/*
* ======================================
* Main Server File (app.js)
* ======================================
* MODIFIED to initialize and use 'express-session'
* and to mount the new 'AuthRoutes'.
*/

const express = require('express');
const path = require('path');
const cors = require('cors');
// NEW: Import express-session
const session = require('express-session');
// Use environment variables
require('dotenv').config();

// Import routers
const mainRouter = require('./routes/index');
// NEW: Import Auth router
const AuthRouter = require('./routes/AuthRoutes');

// Import middleware
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const port = process.env.PORT || 3000;

// --- Middleware Setup ---

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// NEW: Configure Express Sessions
app.use(session({
    // This secret is used to sign the session ID cookie.
    // It should be a long, random string stored in your .env file
    secret: process.env.SESSION_SECRET || 'a_default_very_secret_key_fallback',
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create session until something stored
    cookie: {
        secure: false, // Set to true if you are using HTTPS
        httpOnly: true, // Prevents client-side JS from reading the cookie
        maxAge: 1000 * 60 * 60 * 24 // Cookie expires in 1 day
    }
}));

// Serve static files (HTML, CSS, JS) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// --- API Routes ---

// NEW: Mount the Authentication routes on '/api/Auth'
app.use('/api/Auth', AuthRouter);

// Mount the main API router (Cases, Hearings, etc.) on '/api'
app.use('/api', mainRouter);

// --- Frontend Catch-all ---
// This serves your 'index.html' for any route not matched by the API
// This is important for a Single Page Application (SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- Error Handling ---
// Use the custom error handler middleware
app.use(errorHandler);

// --- Start Server ---
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    // You can add a database connection test here if you like
});

