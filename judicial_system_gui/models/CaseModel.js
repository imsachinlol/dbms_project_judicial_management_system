/*
* ======================================
* Case Model (caseModel.js)
* ======================================
* (This is the FINAL, 100% CORRECTED file)
* This version correctly reads the output
* from the new, robust stored procedure
* and will not create phantom records.
*/

const pool = require('../config/db');

// Find all cases, with optional status filter
const findAll = async (status) => {
    let query = `
        SELECT 
            c.CASE_ID, 
            c.CASE_TITLE, 
            c.CASE_TYPE, 
            c.STATUS, 
            c.DATE_FILED, 
            co.COURT_NAME
        FROM \`CASE\` c
        JOIN COURT co ON c.COURT_ID = co.COURT_ID
    `;

    const params = [];
    if (status) {
        query += ' WHERE c.STATUS = ?';
        params.push(status);
    }
    query += ' ORDER BY c.DATE_FILED DESC';

    const [rows] = await pool.query(query, params);
    return rows;
};

// Find a single case by its ID
const findById = async (caseId) => {
    
    const query = `
        SELECT 
            c.CASE_ID, 
            c.CASE_TITLE, 
            c.CASE_TYPE, 
            c.STATUS, 
            c.DATE_FILED,
            co.COURT_NAME,
            j.OUTCOME AS JUDGEMENT_OUTCOME,
            j.DATE AS JUDGEMENT_DATE,
            ls.SECTION_NUMBER,
            ls.SECTION_TITLE,
            ls.ACT_NAME,
            CONCAT(l.FIRST_NAME, ' ', l.LAST_NAME) AS LITIGANT_NAME,
            CONCAT(law.FIRST_NAME, ' ', law.LAST_NAME) AS LAWYER_NAME,
            law.BAR_COUNCIL_ID,
            GetTotalHearingsForCase(c.CASE_ID) AS TotalHearings
        FROM \`CASE\` c
        LEFT JOIN COURT co ON c.COURT_ID = co.COURT_ID
        LEFT JOIN JUDGEMENT j ON c.CASE_ID = j.CASE_ID
        LEFT JOIN DEALS d ON c.CASE_ID = d.CASE_ID
        LEFT JOIN LAW_SECTION ls ON d.SECTION_ID = ls.SECTION_ID
        LEFT JOIN REPRESENTS r ON c.CASE_ID = r.CASE_ID
        LEFT JOIN LITIGANT l ON r.LITIGANT_ID = l.LITIGANT_ID
        LEFT JOIN LAWYER law ON r.BAR_COUNCIL_ID = law.BAR_COUNCIL_ID
        WHERE c.CASE_ID = ?;
    `;
    const [rows] = await pool.query(query, [caseId]);
    
    if (rows.length === 0) {
        return null;
    }
    
    return rows[0]; 
};


// Create a new case
const create = async (caseData, bar_council_id) => {
    const {
        case_title,
        case_type,
        court_id,
        litigant_id,
        section_id
    } = caseData;

    const sql = 'CALL FileNewCase(?, ?, ?, ?, ?, ?)';
    const params = [
        case_title,
        case_type,
        court_id,
        litigant_id,
        bar_council_id, // Using the secure ID
        section_id
    ];

    console.log(`[caseModel] Executing FileNewCase with params:`, params);

    // *** THIS IS THE FIX ***
    // The procedure will either succeed and return the new ID,
    // or it will fail, ROLLBACK, and throw an error.
    
    // The 'mysql2' driver returns procedure results in a nested array.
    // [resultPacket, fieldPacket]
    // The resultPacket (result[0]) is an array of result sets.
    // Our 'SELECT new_case_id' is the first (and only) result set (result[0][0]).
    const [result] = await pool.query(sql, params);
    
    let newCaseId;
    
    // Check if the result packet is valid and contains our new_case_id
    if (result && result[0] && result[0][0] && result[0][0].new_case_id) {
        newCaseId = result[0][0].new_case_id;
    } else {
         // This can happen if the procedure failed silently (which it won't anymore)
         // or if the result packet is not what we expect.
        throw new Error("Could not get new_case_id from procedure.");
    }
    
    // If we are here, the procedure SUCCEEDED and COMMITTED.
    // We can now safely fetch the new case.
    return findById(newCaseId);
};


// Update a case's status
const updateStatus = async (caseId, status) => {
    const sql = 'UPDATE \`CASE\` SET STATUS = ? WHERE CASE_ID = ?';
    const [result] = await pool.query(sql, [status, caseId]);

    if (result.affectedRows === 0) {
        return null; // No case was found with that ID
    }
    return findById(caseId); // Return the updated case
};

// Delete a case by ID
const deleteById = async (caseId) => {
    const sql = 'DELETE FROM \`CASE\` WHERE CASE_ID = ?';
    const [result] = await pool.query(sql, [caseId]);
    return result.affectedRows; // Returns 1 if successful, 0 if not found
};


module.exports = {
    findAll,
    findById,
    create,
    updateStatus,
    deleteById
};