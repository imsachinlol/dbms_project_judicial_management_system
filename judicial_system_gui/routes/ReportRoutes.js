/*
* ======================================
* Report Routes (ReportRoutes.js)
* ======================================
* This file defines the API endpoints for aggregate Reports.
* (CORRECTED to remove broken route)
*/

const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/ReportController');
const { isAuthenticated } = require('../middlewares/AuthMiddleware');

// Aggregate Query: Get Case counts by type
router.get(
    '/Cases-by-type', 
    isAuthenticated, 
    ReportController.getCasesByType
);

// Nested Query: Get judges who have not presided over any Hearings
router.get(
    '/judges-no-Hearings', 
    isAuthenticated, 
    ReportController.getJudgesWithNoHearings
);

// The broken route for '/Case-history/:Case_id' has been removed.

module.exports = router;