/*
* ======================================
* Judgement Model (judgementModel.js)
* ======================================
* (CORRECTED)
* This file now calls the new 'AddJudgement'
* stored procedure instead of a raw INSERT.
*/

const pool = require('../config/db');

// Add a new judgement by calling the stored procedure
const add = async (judgementData) => {
    const {
        case_id,
        judge_id,
        outcome,
        description
    } = judgementData;

    // *** THIS IS THE CHANGE ***
    // We now call the smart procedure.
    const sql = 'CALL AddJudgement(?, ?, ?, ?)';
    const params = [
        case_id,
        judge_id,
        outcome,
        description
    ];

    // The procedure will handle all logic:
    // 1. Check if status is 'Awaiting Judgment'
    // 2. INSERT into JUDGEMENT
    // 3. The TRIGGER will fire and set status to 'Closed'
    const [result] = await pool.query(sql, params);

    return result[0];
};

module.exports = {
    add
};