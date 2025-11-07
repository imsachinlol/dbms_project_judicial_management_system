/*
* ======================================
* Auth Model (authModel.js)
* ======================================
* (This is the FINAL, 100% CORRECTED file)
* This file fixes the "Bind parameters" error.
*/

const pool = require('../config/db');

// Create a new user in the database
const createUser = async (userData) => {
    
    // userData contains the object from authController, e.g.:
    // { username: '...', password: '...', role: '...',
    //   bar_council_id: '...', first_name: null, last_name: null }
    
    const { username, password, role, bar_council_id, first_name, last_name } = userData;

    const sql = `INSERT INTO USERS (username, password_hash, role, bar_council_id, first_name, last_name)
                 VALUES (?, ?, ?, ?, ?, ?)`;

    // *** THIS IS THE FIX ***
    // We create the 'params' array here and ensure
    // any undefined/null values are correctly passed as 'null' to the DB.
    const params = [
        username,
        password, // This is the hashed password
        role,
        bar_council_id || null,
        first_name || null,
        last_name || null
    ];
    
    // The 'undefined' error was happening because the old code
    // was not cleaning the values before this 'pool.query' call.
    const [result] = await pool.query(sql, params);

    return { user_id: result.insertId };
};

// Find a user by their username
const findByUsername = async (username) => {
    const sql = 'SELECT * FROM USERS WHERE username = ?';
    const [rows] = await pool.query(sql, [username]);
    
    // Return the first match (or null if not found)
    return rows[0]; 
};

module.exports = {
    createUser,
    findByUsername
};