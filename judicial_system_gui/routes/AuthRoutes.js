/*
* ======================================
* Auth Routes (AuthRoutes.js)
* ======================================
* (This is the FINAL, CORRECTED file)
* This file imports ALL four functions from the controller.
*/

const express = require('express');
const router = express.Router();

// *** THIS IS THE FIX ***
// We must import all four functions we plan to use.
const {
    registerUser,
    loginUser,
    logoutUser,
    getAuthStatus  // This was the missing import!
} = require('../controllers/AuthController');

// Route for registering a new user
router.post('/register', registerUser);

// Route for logging in
router.post('/login', loginUser);

// Route for logging out
router.post('/logout', logoutUser);

// Route for checking session status
// This is line 22, which was failing.
router.get('/status', getAuthStatus);

module.exports = router;