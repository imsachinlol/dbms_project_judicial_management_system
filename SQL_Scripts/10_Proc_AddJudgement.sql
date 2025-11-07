/*

======================================

10_proc_AddJudgement.sql

(This is the FINAL, 100% CORRECTED file)

This new procedure adds the database-level

check to ensure judgements are only added

to cases that are 'Awaiting Judgment'.

======================================
*/

USE judicial_system;
DROP PROCEDURE IF EXISTS AddJudgement;

DELIMITER //

CREATE PROCEDURE AddJudgement(
IN p_case_id INT,
IN p_judge_id INT,
IN p_outcome VARCHAR(255),
IN p_description TEXT
)
BEGIN
DECLARE v_case_status VARCHAR(50);

-- Get the current status of the case
SELECT `STATUS` INTO v_case_status 
FROM `CASE` 
WHERE `CASE_ID` = p_case_id;

-- *** THIS IS YOUR NEW LOGIC ***
-- Check if the case is 'Awaiting Judgment'
IF v_case_status = 'Awaiting Judgment' THEN
    -- If yes, insert the judgement.
    -- The 'AfterJudgmentUpdateCaseStatus' trigger
    -- will automatically fire AFTER this insert
    -- and set the case status to 'Closed'.
    INSERT INTO JUDGEMENT (CASE_ID, JUDGE_ID, `DATE`, OUTCOME, DESCRIPTION)
    VALUES (p_case_id, p_judge_id, CURDATE(), p_outcome, p_description);
    
    -- Return a success message
    SELECT 'Judgement added successfully.' AS message;
    
ELSE
    -- If no, block the action and send an error.
    SIGNAL SQLSTATE '45000' 
    SET MESSAGE_TEXT = 'Cannot add judgement: The case is not "Awaiting Judgment".';
END IF;


END //

DELIMITER ;