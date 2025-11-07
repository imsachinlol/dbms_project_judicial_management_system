/*
 * ======================================
 * 08_VERIFY.SQL
 * ======================================
 * This script runs various test queries to verify
 * the procedures, functions, triggers, and other operations.
 * You can run this last to see the outputs.
 */

USE judicial_system;

-- --- Simple SELECTs, UPDATE, DELETE ---
SELECT "--- All Hearings for Case 1 (Initial) ---";
SELECT * FROM HEARING WHERE CASE_ID = 1;

SELECT "--- Inserting a new hearing for Case 1 ---";
INSERT INTO HEARING (CASE_ID, DATE, SUMMARY) VALUES (1, '2024-04-25', 'Final arguments to be heard.');
SELECT * FROM HEARING WHERE CASE_ID = 1;

SELECT "--- Detailed Join Query for Case 1 ---";
SELECT
    c.CASE_ID,
    c.CASE_TITLE,
    c.STATUS,
    co.COURT_NAME,
    l.FIRST_NAME AS LITIGANT_FIRST_NAME,
    l.LAST_NAME AS LITIGANT_LAST_NAME,
    law.FIRST_NAME AS LAWYER_FIRST_NAME,
    law.LAST_NAME AS LAWYER_LAST_NAME
FROM `CASE` c
JOIN COURT co ON c.COURT_ID = co.COURT_ID
JOIN REPRESENTS r ON c.CASE_ID = r.CASE_ID
JOIN LITIGANT l ON r.LITIGANT_ID = l.LITIGANT_ID
JOIN LAWYER law ON r.BAR_COUNCIL_ID = law.BAR_COUNCIL_ID
WHERE c.CASE_ID = 1;

SELECT "--- Updating Case 1 Status ---";
UPDATE `CASE`
SET STATUS = 'Awaiting Judgment'
WHERE CASE_ID = 1;
SELECT CASE_ID, CASE_TITLE, STATUS FROM `CASE` WHERE CASE_ID = 1;

SELECT "--- Deleting Hearing ID 3 ---";
DELETE FROM HEARING
WHERE HEARING_ID = 3;
SELECT * FROM HEARING WHERE CASE_ID = 1;

-- --- Test Procedure: FileNewCase ---
SELECT "--- Calling Procedure: FileNewCase (Case 3) ---";
CALL FileNewCase('Property Dispute A vs B', 'Civil', 1, 1, 'KAR/1234/2005', 2);
SELECT * FROM `CASE` WHERE CASE_TITLE = 'Property Dispute A vs B';
SELECT * FROM REPRESENTS WHERE CASE_ID = LAST_INSERT_ID();

-- --- Test Function: GetTotalHearingsForCase ---
SELECT "--- Calling Function: GetTotalHearingsForCase (Case 1) ---";
SELECT
    CASE_TITLE,
    STATUS,
    GetTotalHearingsForCase(CASE_ID) AS TotalHearings
FROM `CASE`
WHERE CASE_ID = 1;

-- --- Test Trigger: AfterJudgmentUpdateCaseStatus ---
SELECT "--- Testing Trigger: Inserting Judgment for Case 1 ---";
SELECT "--- Status of Case 1 BEFORE Judgment ---";
SELECT STATUS FROM `CASE` WHERE CASE_ID = 1;

INSERT INTO JUDGEMENT (CASE_ID, JUDGE_ID, DATE, OUTCOME, DESCRIPTION)
VALUES (1, 123, '2025-12-01', 'Dismissed', 'The case was dismissed due to lack of evidence.');

SELECT "--- Status of Case 1 AFTER Judgment (should be 'Closed') ---";
SELECT STATUS FROM `CASE` WHERE CASE_ID = 1;

-- --- Final simple check ---
SELECT * FROM judge;
