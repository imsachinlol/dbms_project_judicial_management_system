/*
* ======================================
* Report Model (reportModel.js)
* ======================================
* (This is the FINAL, 100% CORRECTED file)
* This version correctly EXPORTS the functions.
*/

const pool = require('../config/db');

// Get case counts by type (Aggregate)
const getCasesByType = async () => {
    const sql = 'SELECT CASE_TYPE, COUNT(*) as COUNT FROM `CASE` GROUP BY CASE_TYPE';
    const [rows] = await pool.query(sql);
    return rows;
};

// Get judges who have not presided over any hearings (Nested)
const getJudgesWithNoHearings = async () => {
    const sql = `
        SELECT JUDGE_ID, FIRST_NAME, LAST_NAME
        FROM JUDGE
        WHERE JUDGE_ID NOT IN (
            SELECT DISTINCT JUDGE_ID FROM PRECIDE
        )
    `;
    const [rows] = await pool.query(sql);
    return rows;
};

// *** THIS IS THE FIX ***
// The functions are now correctly exported.
module.exports = {
    getCasesByType,
    getJudgesWithNoHearings
};