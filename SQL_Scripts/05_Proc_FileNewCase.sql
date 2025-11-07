/*
 * ======================================
 * 04_proc_FileNewCase.sql
 * (This is the FINAL, 100% CORRECTED file)
 * This version includes proper error handling
 * with 'ROLLBACK' to prevent phantom records.
 * ======================================
 */

USE judicial_system;
DROP PROCEDURE IF EXISTS FileNewCase;

DELIMITER //

CREATE PROCEDURE FileNewCase(
    IN p_case_title VARCHAR(255),
    IN p_case_type VARCHAR(100),
    IN p_court_id INT,
    IN p_litigant_id INT,
    IN p_lawyer_bar_id VARCHAR(50),
    IN p_section_id INT
)
BEGIN
    DECLARE new_case_id INT;
    
    -- *** THIS IS THE FIX ***
    -- Declare an exit handler for SQL exceptions
    -- If any error occurs, it will ROLLBACK and send the error message.
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Roll back the transaction
        ROLLBACK;
        -- Resignal the error to the calling application
        RESIGNAL;
    END;

    -- Start the transaction
    START TRANSACTION;

    -- 1. Insert the new case into the CASE table.
    INSERT INTO `CASE` (CASE_TITLE, CASE_TYPE, STATUS, DATE_FILED, COURT_ID)
    VALUES (p_case_title, p_case_type, 'Ongoing', CURDATE(), p_court_id);

    -- Get the ID of the case just created.
    SET new_case_id = LAST_INSERT_ID();

    -- 2. Link the case to the relevant law section in the DEALS table.
    INSERT INTO DEALS (CASE_ID, SECTION_ID)
    VALUES (new_case_id, p_section_id);

    -- 3. Link the litigant and lawyer to the case in the REPRESENTS table.
    -- (This is the step that failed before with Litigant 4)
    INSERT INTO REPRESENTS (CASE_ID, LITIGANT_ID, BAR_COUNCIL_ID)
    VALUES (new_case_id, p_litigant_id, p_lawyer_bar_id);

    -- 4. If all inserts were successful, commit the transaction.
    COMMIT;
    
    -- 5. Return the new Case ID so the model can find it.
    SELECT new_case_id AS new_case_id;

END //

DELIMITER ;