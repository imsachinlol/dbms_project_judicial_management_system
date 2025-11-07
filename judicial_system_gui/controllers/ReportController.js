/*
* ======================================
* Report Controller (ReportController.js)
* ======================================
* This is the CORRECT, COMPLETE file.
* It defines the functions that ReportRoutes.js needs.
*/

const ReportModel = require('../models/ReportModel');

// Controller for Aggregate Query: Get Case counts by type
const getCasesByType = async (req, res, next) => {
    try {
        const data = await ReportModel.getCasesByType();
        res.status(200).json(data);
    } catch (error) {
        console.error('Error in getCasesByType controller:', error);
        next(error); // Pass to error handler
    }
};

// Controller for Nested Query: Get judges with no Hearings
const getJudgesWithNoHearings = async (req, res, next) => {
    try {
        const data = await ReportModel.getJudgesWithNoHearings();
        res.status(200).json(data);
    } catch (error) {
        console.error('Error in getJudgesWithNoHearings controller:', error);
        next(error); // Pass to error handler
    }
};

// *** THIS IS THE CRITICAL PART ***
// We must export the functions so the routes can use them.
module.exports = {
    getCasesByType,
    getJudgesWithNoHearings
};