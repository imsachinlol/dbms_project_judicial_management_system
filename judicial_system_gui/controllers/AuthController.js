/*
* ======================================
* Auth Controller (AuthController.js)
* ======================================
* (This is the FINAL, 100% CORRECTED file)
* Fixes "Bind parameters" error AND exports all functions.
*/

const AuthModel = require('../models/AuthModel');
const bcrypt = require('bcryptjs');

// Controller for registering a new user
const registerUser = async (req, res, next) => {
    // We get all fields from the body.
    const { username, password, role, bar_council_id, first_name, last_name } = req.body;

    // Validation
    if (!username || !password || !role) {
        return res.status(400).json({ message: 'Username, password, and role are required.' });
    }
    
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // *** THIS IS THE FIX for "Bind parameters" ***
        // We create a new user object, checking for undefined values
        // and converting them to 'null' so the database accepts them.
        const newUser = await AuthModel.createUser({
            username,
            password: hashedPassword,
            role,
            bar_council_id: bar_council_id || null, // Coalesce to null
            first_name: first_name || null,     // Coalesce to null
            last_name: last_name || null      // Coalesce to null
        });

        res.status(201).json({ message: 'User registered successfully', userId: newUser.user_id });

    } catch (error) {
        // Handle common errors
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Username already exists.' });
        }
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
             return res.status(400).json({ message: 'Invalid Bar Council ID: This lawyer does not exist in the database.' });
        }
        next(error); // Pass other errors to the main handler
    }
};

// Controller for logging in a user
const loginUser = async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    try {
        // Find the user by username
        const user = await AuthModel.findByUsername(username);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials: User not found.' });
        }

        // Compare the provided password with the stored hash
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials: Password incorrect.' });
        }

        // Password is correct! Create a session.
        const sessionUser = {
            user_id: user.user_id,
            username: user.username,
            role: user.role,
            bar_council_id: user.bar_council_id
        };

        // Store user in session
        req.session.user = sessionUser;

        res.status(200).json({ message: 'Login successful', user: sessionUser });

    } catch (error) {
        next(error);
    }
};

// Controller for logging out a user
const logoutUser = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            return next(err);
        }
        res.clearCookie('connect.sid'); // Clears the session cookie
        res.status(200).json({ message: 'Logout successful' });
    });
};

// Controller for checking the current session status
const getAuthStatus = (req, res, next) => {
    if (req.session.user) {
        // User is logged in
        res.status(200).json({ user: req.session.user });
    } else {
        // User is not logged in
        res.status(200).json({ user: null });
    }
};

// *** THIS IS THE CRITICAL EXPORT ***
module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getAuthStatus
};