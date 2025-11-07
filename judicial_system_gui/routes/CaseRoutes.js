/*
* ======================================
* Case Routes (caseRoutes.js)
* ======================================
* (CORRECTED)
* The 'update' route (PUT) is now set to 'isAdmin'
* as per the new security requirement.
*/

const express = require('express');
const router = express.Router();
const caseController = require('../controllers/CaseController');

// Import the auth middleware "bouncers"
const { isAuthenticated, isLawyer, isAdmin } = require('../middlewares/AuthMiddleware');

// Route to get all cases (and filter by status)
// This is PUBLIC - anyone (guest or logged in) can see cases.
router.get('/', caseController.getAllCases);

// Route to get a single case by its ID
// This is PUBLIC - anyone can see case details.
router.get('/:case_id', caseController.getCaseById);

// Route to file a new case
// PROTECTED: Must be logged in AND be a lawyer.
router.post('/', isAuthenticated, isLawyer, caseController.fileNewCase);

// Route to update a case's status
// *** THIS IS THE SECURITY CHANGE ***
// PROTECTED: Must be logged in AND be an ADMIN.
router.put('/:case_id', isAuthenticated, isAdmin, caseController.updateCaseStatus);

// Route to delete a case
// PROTECTED: Must be logged in AND be an ADMIN.
router.delete('/:case_id', isAuthenticated, isAdmin, caseController.deleteCase);

module.exports = router;