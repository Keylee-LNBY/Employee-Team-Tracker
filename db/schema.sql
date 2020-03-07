  
-- if database exists: drop it 
DROP DATABASE IF EXISTS trackerDB;

-- create a database
CREATE DATABASE trackerDB;

-- use the database you created 
USE trackerDB;

-- create some tables 
CREATE TABLE employee (
    id INTEGER AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30) NOT NULL, 
    last_name VARCHAR(30) NOT NULL,
    -- role_id will be a FORGEIGN key and will reference to the role table
    role_id INTEGER,
    INDEX role_ind (role_id),
    -- manager_id will be a FORGEIGN key
    manager_id INTEGER,
    INDEX mang_ind (manager_id),
    PRIMARY KEY (id)
);

CREATE TABLE role (
    id INTEGER AUTO_INCREMENT NOT NULL,
    title VARCHAR(30),
    salary	DECIMAL(10,2),
    -- department_id will be a FORGEIN key and will reference to the department table
    department_id INT,
    PRIMARY KEY (id)
);

CREATE TABLE department (
    id INTEGER AUTO_INCREMENT NOT NULL,
    name VARCHAR(30),
    PRIMARY KEY (id)
);
