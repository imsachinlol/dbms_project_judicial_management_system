/*
 * ======================================
 * 05_PROC_SCHEDULENEWHEARING.SQL
 * ======================================
 * Creates the procedure to schedule a new hearing.
 */

USE judicial_system;

DELIMITER //

CREATE PROCEDURE ScheduleNewHearing(
    IN p_case_id INT,
    IN p_judge_id INT,
    IN p_hearing_date DATE,
    IN p_summary TEXT
)
BEGIN
    DECLARE new_hearing_id INT;
    DECLARE case_status VARCHAR(50);

    -- Check if the case is still ongoing before scheduling a hearing.
    SELECT STATUS INTO case_status FROM `CASE` WHERE CASE_ID = p_case_id;

    IF case_status = 'Ongoing' THEN
        START TRANSACTION;

        -- 1. Insert the new hearing record.
        INSERT INTO HEARING (CASE_ID, DATE, SUMMARY)
        VALUES (p_case_id, p_hearing_date, p_summary);

        -- Get the ID of the new hearing.
        SET new_hearing_id = LAST_INSERT_ID();

        -- 2. Assign the judge to the hearing in the PRECIDE table.
        INSERT INTO PRECIDE (HEARING_ID, CASE_ID, JUDGE_ID)
        VALUES (new_hearing_id, p_case_id, p_judge_id);

        COMMIT;
    ELSE
        -- If the case is not ongoing, signal an error.
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot schedule hearing: The case is not ongoing.';
    END IF;

END //

DELIMITER ;
