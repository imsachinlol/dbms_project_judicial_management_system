/*
 * ======================================
 * 07_TRG_AFTERJUDGMENTUPDATECASESTATUS.SQL
 * ======================================
 * Creates the trigger to update case status to 'Closed'
 * after a judgment is inserted.
 */

USE judicial_system;

DELIMITER //

CREATE TRIGGER AfterJudgmentUpdateCaseStatus
AFTER INSERT ON JUDGEMENT
FOR EACH ROW
BEGIN
    UPDATE `CASE`
    SET STATUS = 'Closed'
    WHERE CASE_ID = NEW.CASE_ID;
END //

DELIMITER ;
