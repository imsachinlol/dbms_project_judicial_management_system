/*
* ======================================
* Error Handler (middlewares/errorHandler.js)
* ======================================
* A central middleware to catch and format errors.
*/

const errorHandler = (error, req, res, next) => {
    console.error('An error occurred:', error.message);
    console.error('SQL State:', error.sqlState); // Log SQL-specific info

    // Handle custom error from 'ScheduleNewHearing' procedure
    if (error.sqlState === '45000') {
        return res.status(400).json({ success: false, message: error.sqlMessage });
    }

    // Handle foreign key constraint errors on DELETE
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
         return res.status(400).json({ success: false, message: 'Cannot delete: This record is referenced by other data.' });
    }

    // Generic server error
    res.status(500).json({
        success: false,
        message: 'An internal server error occurred.',
        error: error.message // Only show detailed error in development
    });
};

module.exports = errorHandler;
