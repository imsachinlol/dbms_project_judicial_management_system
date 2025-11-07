/*
* ======================================
* Hearing Model (models/HearingModel.js)
* ======================================
*/

const dbPool = require('../config/db');

// [Create] Calls stored procedure
exports.create = async (HearingData) => {
    const { Case_id, judge_id, date, summary } = HearingData;
    const query = 'CALL ScheduleNewHearing(?, ?, ?, ?)';
    // The procedure will throw an error if the Case is not 'Ongoing'
    await dbPool.query(query, [Case_id, judge_id, date, summary]);
};
