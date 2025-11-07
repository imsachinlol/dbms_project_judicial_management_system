/*
 * ======================================
 * 03_CLEANUP_ROUTINES.SQL
 * ======================================
 * This script DROPs all procedures, functions, and triggers.
 * Run this *before* creating routines to avoid 'Already Exists' errors.
 */

USE judicial_system;

DROP PROCEDURE IF EXISTS FileNewCase;
DROP PROCEDURE IF EXISTS ScheduleNewHearing;
DROP FUNCTION IF EXISTS GetTotalHearingsForCase;
DROP TRIGGER IF EXISTS AfterJudgmentUpdateCaseStatus;
