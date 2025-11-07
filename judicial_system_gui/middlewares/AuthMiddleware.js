/*
 * ======================================
 * Auth Middleware (AuthMiddleware.js)
 * ======================================
 * These are the "bouncers" for your API routes.
 * They check if a user is logged in and what their role is.
 */

// Checks if a user is logged in at all
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        // User is logged in, proceed to the route
        next();
    } else {
        res.status(401).json({ message: 'UnAuthorized: You must be logged in.' });
    }
};

// Checks if the user is a Lawyer (or an Admin, who can do more)
const isLawyer = (req, res, next) => {
    if (req.session.user && (req.session.user.role === 'lawyer' || req.session.user.role === 'admin')) {
        // User is a lawyer or admin, proceed
        next();
    } else {
        res.status(403).json({ message: 'Forbidden: This action is for lawyers only.' });
    }
};

// Checks if the user is an Admin
const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        // User is an admin, proceed
        next();
    } else {
        res.status(403).json({ message: 'Forbidden: This action is for admins only.' });
    }
};

module.exports = {
    isAuthenticated,
    isLawyer,
    isAdmin
};
