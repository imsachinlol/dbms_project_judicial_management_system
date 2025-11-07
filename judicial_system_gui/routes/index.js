/*
* ======================================
* Main Router (index.js)
* ======================================
* (This is the FINAL, 100% CORRECTED file)
* This version uses all lowercase routes
* to be consistent.
*/

const express = require('express');
const router = express.Router();

// Import all the specific routers
const caseRoutes = require('./CaseRoutes');
const hearingRoutes = require('./HearingRoutes');
const judgementRoutes = require('./JudgementRoutes');
const reportRoutes = require('./ReportRoutes');
const authRoutes = require('./AuthRoutes');

// === API Switchboard ===
// All routes are now lowercase

router.use('/auth', authRoutes);
router.use('/cases', caseRoutes);
router.use('/hearings', hearingRoutes);
router.use('/judgements', judgementRoutes);
router.use('/reports', reportRoutes);

module.exports = router;