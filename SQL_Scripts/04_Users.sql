/*
 * ======================================
 * 09_USERS.SQL
 * ======================================
 * Creates the USERS table for authentication and roles.
 */

USE judicial_system;

-- 1. Create the USERS table
CREATE TABLE USERS (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    -- 'public' role is handled by the app, not in the DB
    -- Only 'lawyer' and 'admin' roles need to log in.
    role ENUM('lawyer', 'admin') NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    -- Link to the LAWYER table.
    -- This key is NULLABLE because an 'admin' might not be a 'lawyer'
    bar_council_id VARCHAR(50) NULL,
    FOREIGN KEY (bar_council_id) REFERENCES LAWYER(bar_council_id)
);

-- 2. (Example) Insert a hashed password for a lawyer
-- The password 'lawyer123' becomes a hash
-- We will do this from our Node.js app (via the registration form)
/*
INSERT INTO USERS (username, password_hash, role, first_name, last_name, bar_council_id)
VALUES ('lawyer_rajesh', '$2a$10$faw...hash.../E.e', 'lawyer', 'Rajesh', 'Kumar', 'KAR/1234/2005');
*/

-- 3. (Example) Insert a hashed password for an admin
-- The password 'admin123'
/*
INSERT INTO USERS (username, password_hash, role, first_name, last_name)
VALUES ('admin_priya', '$2a$10$abc...hash.../d.F', 'admin', 'Priya', 'Rao');
*/
