/*
 * ======================================
 * 06_FUNC_GETTOTALHEARINGSFORCASE.SQL
 * ======================================
 * Creates the function to count hearings for a case.
 */

USE judicial_system;

DELIMITER //

CREATE FUNCTION GetTotalHearingsForCase(p_case_id INT)
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE hearing_count INT;

    SELECT COUNT(*)
    INTO hearing_count
    FROM HEARING
    WHERE CASE_ID = p_case_id;

    RETURN hearing_count;
END //

DELIMITER ;
