/*
* ======================================
* Hearing Routes (HearingRoutes.js)
* ======================================
* MODIFIED to protect routes with Authentication middleware.
*/

const express = require('express');
const router = express.Router();
const HearingController = require('../controllers/HearingController');

// NEW: Import the Auth middleware
const { isAuthenticated, isLawyer } = require('../middlewares/AuthMiddleware');

// Route to schedule a new Hearing for a Case
// PROTECTED: Must be logged in AND be a lawyer.
router.post('/', isAuthenticated, isLawyer, HearingController.scheduleNewHearing);

module.exports = router;

