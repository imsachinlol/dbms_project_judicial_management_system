/*
* ======================================
* Hearing Controller - FIXED VERSION
* ======================================
* Fixed field name mapping
*/

const HearingModel = require('../models/HearingModel');

exports.scheduleNewHearing = async (req, res, next) => {
    try {
        // FIX: Accept both 'case_id' and 'Case_id' for compatibility
        const { case_id, Case_id, judge_id, date, summary } = req.body;
        
        // Use whichever field was provided
        const caseId = case_id || Case_id;
        
        console.log('Received hearing data:', req.body);
        
        if (!caseId || !judge_id || !date || !summary) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields.',
                received: { caseId, judge_id, date, summary }
            });
        }

        await HearingModel.create({ 
            Case_id: caseId,  // Model expects 'Case_id'
            judge_id, 
            date, 
            summary 
        });
        
        res.status(201).json({ 
            success: true, 
            message: 'Hearing scheduled successfully.' 
        });
    } catch (error) {
        console.error('Hearing scheduling error:', error);
        next(error);
    }
};