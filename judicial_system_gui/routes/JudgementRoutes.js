/*
* ======================================
* Judgement Routes (JudgementRoutes.js)
* ======================================
* (This is the FINAL, 100% CORRECTED file)
* This file now correctly imports and uses
* the 'addJudgement' function.
*/

const express = require('express');
const router = express.Router();

// *** THIS IS THE FIX ***
// We import the *specific function* from the controller
const { addJudgement } = require('../controllers/JudgementController');
const { isAuthenticated, isAdmin } = require('../middlewares/AuthMiddleware');

// Route to add a new judgement
// (This is line 17, which was failing)
router.post(
    '/',
    isAuthenticated,
    isAdmin,
    addJudgement  // This is now a valid function
);

module.exports = router;