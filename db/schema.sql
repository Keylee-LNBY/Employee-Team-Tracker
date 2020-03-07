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


-- RUN SEED FILE --
--Then run below sql code
SELECT e.id, e.first_name, e.last_name, d.name AS department, r.title, r.salary, CONCAT_WS(" ", m.first_name, m.last_name) AS manager 
FROM employee e
LEFT JOIN employee m ON m.id = e.manager_id
INNER JOIN role r ON e.role_id = r.id 
INNER JOIN department d ON r.department_id = d.id 
ORDER BY e.id ASC;

SELECT e.first_name, e.last_name, r.title, d.name FROM employee e INNER JOIN role r ON e.role_id = r.id INNER JOIN department d ON r.department_id = d.id WHERE d.name = "Marketing";

SELECT id, first_name, last_name, CONCAT_WS(" ", first_name, last_name) AS managers FROM employee;

SELECT id, first_name, last_name, CONCAT_WS(' ', first_name, last_name) AS employees FROM employee;

DELETE FROM employee WHERE id = 5;

INSERT INTO  employee (first_name, last_name, role_id, manager_id)
VALUES ("Test", "Case", 5, 5);

SELECT e.first_name, e.last_name, r.title, d.name FROM employee e INNER JOIN role r ON e.role_id = r.id INNER JOIN department d ON r.department_id = d.id WHERE e.manager_id = 1;