/*
 * ======================================
 * 02_data.sql
 * Inserts sample data into the tables.
 * CORRRECTED VERSION
 * ======================================
 */

USE judicial_system;

-- Insert Courts
INSERT INTO COURT (COURT_NAME, COURT_TYPE, CITY, STATE, PINCODE) VALUES
('City Civil Court', 'District', 'Bengaluru', 'Karnataka', '560001'),
('High Court of Karnataka', 'High Court', 'Bengaluru', 'Karnataka', '560001');

-- Insert Judges
INSERT INTO JUDGE (JUDGE_ID, COURT_ID, FIRST_NAME, LAST_NAME, DOB, APPOINTMENT_DATE) VALUES
(123, 1, 'Anand', 'Sharma', '1970-05-20', '2010-08-15'),
(124, 2, 'Priya', 'Rao', '1965-11-30', '2008-03-22');

-- Insert Lawyers
INSERT INTO LAWYER (BAR_COUNCIL_ID, FIRST_NAME, LAST_NAME, PHONE_NUMBER, CITY, STATE) VALUES
('KAR/1234/2005', 'Rajesh', 'Kumar', '9876543210', 'Bengaluru', 'Karnataka'),
('KAR/5678/2010', 'Sunita', 'Patil', '9876543211', 'Bengaluru', 'Karnataka');

-- Insert Litigants (e.g., Petitioner and Respondent)
INSERT INTO LITIGANT (FIRST_NAME, LAST_NAME, PHONE_NUMBER, CITY, STATE) VALUES
('Amit', 'Singh', '8123456789', 'Bengaluru', 'Karnataka'),
('Varun', 'Desai', '8123456780', 'Mysuru', 'Karnataka');

-- Insert Law Sections
INSERT INTO LAW_SECTION (ACT_NAME, SECTION_NUMBER, SECTION_TITLE) VALUES
('Indian Penal Code', '302', 'Punishment for murder'),
('Code of Civil Procedure', '151', 'Inherent powers of Court');

-- Insert a Case
INSERT INTO `CASE` (CASE_TITLE, CASE_TYPE, STATUS, DATE_FILED, COURT_ID) VALUES
('Amit Singh vs. Varun Desai', 'Civil', 'Ongoing', '2024-01-10', 1);

-- Link the case with the relevant law section
INSERT INTO DEALS (CASE_ID, SECTION_ID) VALUES (1, 2);

-- Link the case with lawyers and litigants
INSERT INTO REPRESENTS (CASE_ID, BAR_COUNCIL_ID, LITIGANT_ID) VALUES
(1, 'KAR/1234/2005', 1), -- Rajesh Kumar represents Amit Singh
(1, 'KAR/5678/2010', 2); -- Sunita Patil represents Varun Desai

-- Insert Hearings for the Case
INSERT INTO HEARING (CASE_ID, DATE, SUMMARY) VALUES
(1, '2024-02-15', 'First hearing, arguments presented by both parties.'),
(1, '2024-03-20', 'Witness examination for the petitioner.');

-- Link the judge to the hearings they presided over
-- *** THIS IS THE CORRECTED LINE ***
INSERT INTO PRECIDE (HEARING_ID, CASE_ID, JUDGE_ID) VALUES
(1, 1, 123),  -- Was 1, 1, 1
(2, 1, 123);  -- Was 2, 1, 1

-- Insert another case that is closed
INSERT INTO `CASE` (CASE_TITLE, CASE_TYPE, STATUS, DATE_FILED, COURT_ID) VALUES
('State of Karnataka vs. John Doe', 'Criminal', 'Closed', '2023-05-20', 2);
INSERT INTO DEALS (CASE_ID, SECTION_ID) VALUES (2, 1);

-- Insert a Judgement for the closed case
-- *** THIS IS ALSO CORRECTED to use a valid Judge ID ***
INSERT INTO JUDGEMENT (CASE_ID, JUDGE_ID, DATE, OUTCOME, DESCRIPTION) VALUES
(2, 123, '2024-06-01', 'Guilty', 'The accused was found guilty and sentenced to 10 years imprisonment.');

-- Insert one more hearing for case 1
INSERT INTO HEARING (CASE_ID, DATE, SUMMARY) VALUES (1, '2024-04-25', 'Final arguments to be heard.');

-- Test queries to see initial state
SELECT * FROM HEARING WHERE CASE_ID = 1;

UPDATE `CASE`
SET STATUS = 'Awaiting Judgment'
WHERE CASE_ID = 1;

SELECT CASE_ID, CASE_TITLE, STATUS FROM `CASE` WHERE CASE_ID = 1;

DELETE FROM HEARING
WHERE HEARING_ID = 3;

SELECT * FROM HEARING WHERE CASE_ID = 1;