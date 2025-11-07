/*
* ======================================
* Judgement Controller (judgementController.js)
* ======================================
* (This is the FINAL, 100% CORRECTED file)
* This file provides the 'addJudgement' function
* that your route file is missing.
*/

const judgementModel = require('../models/JudgementModel');

// Controller for adding a new judgement
const addJudgement = async (req, res, next) => {
    try {
        // We get the data from the form body
        const judgementData = {
            case_id: req.body.case_id,
            judge_id: req.body.judge_id,
            outcome: req.body.outcome,
            description: req.body.description
        };

        // We send this data to the model, which will call
        // your new smart 'AddJudgement' stored procedure.
        await judgementModel.add(judgementData);
        
        // If the procedure succeeds, send a 201 (Created)
        res.status(201).json({ message: 'Judgement added successfully.' });
        
    } catch (error) {
        // If the procedure fails (e.g., wrong status),
        // it will be caught here and passed to the error handler.
        next(error);
    }
};

// *** THIS IS THE CRITICAL EXPORT ***
module.exports = {
    addJudgement
};