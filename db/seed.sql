INSERT INTO  employee (first_name, last_name, role_id) VALUES
	("Chris", "Delia", 1),
    ("Jessica", "Krison", 1),
    ("Iliza", "Shlesinger", 3),
    ("Bobby", "Lee", 2),
    ("Bob", "Sagot", 4),
    ("Ali", "Macofsky", 3),
    ("Daniel", "Sloss", 1);
    
INSERT INTO role (title, salary, department_id) VALUES 
	("Stand Up Comedian L5", 150000.00, 1), 
    ("Stand Up Comedian L3", 85000.00, 1), 
    ("Club Relations", 50000.00, 2), 
    ("Social Media Advertiser", 45000.00, 3), 
    ("Public Relations Manager", 70000.00, 3), 
    ("Legal Consoltant", 80000.00, 4);

INSERT INTO department (name) VALUES
	("Talent"), 
    ("Agents"), 
    ("Marketing"), 
    ("Legal");

SELECT * FROM role;
SELECT title FROM role;
SELECT * FROM department;
SELECT * FROM employee;