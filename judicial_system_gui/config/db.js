/*
* ======================================
* Database Config (db.js)
* ======================================
* (MODIFIED FOR DEBUGGING)
*/

const mysql = require('mysql2/promise');
// We also call config() here as a safety measure
require('dotenv').config();

// ---!! DEBUGGING TEST !!---
// Let's print the environment variables as this file sees them.
console.log("--- DEBUGGING DB_CONFIG (from config/db.js) ---");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "Loaded (hidden)" : undefined);
console.log("DB_NAME:", process.env.DB_NAME); // <-- This is the one that matters
console.log("-----------------------------------------------");

const dbPool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME, // This line is causing the error
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = dbPool;