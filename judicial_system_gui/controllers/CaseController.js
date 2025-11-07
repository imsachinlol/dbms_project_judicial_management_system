/*
* ======================================
* Case Controller (CaseController.js)
* ======================================
* MODIFIED to be "Auth-aware".
* Specifically, fileNewCase now gets the lawyer ID
* from the session, not from the request body.
*/

const CaseModel = require('../models/CaseModel');

// Get all Cases (Public)
// No changes needed, this route is public.
const getAllCases = async (req, res, next) => {
    try {
        // Get status from query string, if it exists
        const status = req.query.status;
        const Cases = await CaseModel.findAll(status);
        res.status(200).json(Cases);
    } catch (error) {
        next(error); // Pass to error handler
    }
};

// Get a single Case by ID (Public)
// No changes needed, this route is public.
const getCaseById = async (req, res, next) => {
    try {
        const CaseId = req.params.case_id;
        const CaseData = await CaseModel.findById(CaseId);
        if (!CaseData) {
            return res.status(404).json({ message: 'Case not found' });
        }
        res.status(200).json(CaseData);
    } catch (error) {
        next(error);
    }
};

// File a new Case (Lawyer only)
// *** THIS IS THE KEY MODIFICATION ***
const fileNewCase = async (req, res, next) => {
    try {
        // 1. Get Case data from the request body
        // This includes title, type, court_id, litigant_id, section_id
        const CaseData = req.body;

        // 2. *** IMPORTANT SECURITY CHANGE ***
        // Get the lawyer's Bar Council ID securely from their session.
        // We set this in AuthController.js during login.
        // This prevents a logged-in lawyer from impersonating another
        // by just sending a different bar_council_id in the req.body.
        const bar_council_id = req.session.user.bar_council_id;

        // 3. Security check: Does this user account even have a lawyer ID?
        if (!bar_council_id) {
            return res.status(403).json({ message: 'Forbidden: Your user account is not linked to a Bar Council ID.' });
        }

        // 4. Log for debugging
        console.log(`[CaseController] Attempting to file new Case for lawyer: ${bar_council_id}`);

        // 5. Call the model function, passing both the form data and the secure ID
        // (We will update CaseModel.js next to handle this)
        const newCase = await CaseModel.create(CaseData, bar_council_id);
        
        res.status(201).json({ message: 'Case filed successfully', data: newCase });

    } catch (error) {
        // Handle specific errors from the stored procedure
        if (error.code === 'ER_CALL_ERROR' || error.sqlMessage) {
            console.error('SQL Procedure Error:', error.sqlMessage);
            return res.status(400).json({ message: `Database procedure error: ${error.sqlMessage}` });
        }
        next(error);
    }
};

// Update a Case's status (Lawyer only, as defined in routes)
// No changes to this function's logic are needed.
// The middleware in CaseRoutes.js already protects it.
const updateCaseStatus = async (req, res, next) => {
    try {
        const CaseId = req.params.case_id;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        console.log(`[CaseController] Updating Case ${CaseId} to status: ${status}`);

        const updatedCase = await CaseModel.updateStatus(CaseId, status);
        
        if (!updatedCase) {
            return res.status(404).json({ message: 'Case not found or status unchanged' });
        }
        
        res.status(200).json({ message: 'Case status updated', data: updatedCase });

    } catch (error) {
        next(error);
    }
};

// Delete a Case (Admin only, as defined in routes)
// No changes to this function's logic are needed.
// The middleware in CaseRoutes.js already protects it.
const deleteCase = async (req, res, next) => {
    try {
        const CaseId = req.params.case_id;
        console.log(`[CaseController] Deleting Case ${CaseId}`);
        
        await CaseModel.deleteById(CaseId);
        
        res.status(200).json({ message: `Case ${CaseId} deleted successfully` });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllCases,
    getCaseById,
    fileNewCase,
    updateCaseStatus,
    deleteCase
};

