//Dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

// Global Variables
let roles;
let managers;

//Create Connection
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "trackerDB"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    //a console.log(of the EMPLOYEE WELCOME MESSAEGE)
    srcByRole();
    initApplication();
});

// Start Application
const initApplication = () => {
    inquirer.prompt([
        {
        message: "What would you like to do?",
        type: "list",
        choices: ["View All Employees", "View All Employees By Department", "Add Employee", "Update Employee Role"],
        name: "initApplication"
        }
    ]).then(({ initApplication }) => {
        switch (initApplication) {
        case "View All Employees":
            viewAll();
            break;
        case "View All Employees By Department":
            viewAllByDepartment();
            break;
        case "Add Employee":
            addEmployee();
            break;
        case "Update Employee Role":
            updateRole();
            break;
        }
    });
};

const srcByRole = () => {
    let query = "SELECT id, title FROM role";
    connection.query(query, function (err, res) {
        roles = res;
    });
};

//Functions for the initApplication Call
//View all Employees
const viewAll = () => {
    let query = 'SELECT e.id, e.first_name, e.last_name, d.name AS department, r.title, r.salary, CONCAT_WS(" ", m.first_name, m.last_name) AS manager FROM employee e LEFT JOIN employee m ON m.id = e.manager_id INNER JOIN role r ON e.role_id = r.id INNER JOIN department d ON r.department_id = d.id ORDER BY e.id ASC';
    
    connection.query(query, function (err, res) {
        let table = [];
        for (var i = 0; i < res.length; i++) {
            table.push({ id: res[i].id, name: res[i].first_name + " " + res[i].last_name, title: res[i].title, salary: res[i].salary, department: res[i].department, manager: res[i].manager});
        };
        console.log(consoleTable.getTable(table));
        initApplication();
    });
};

//View All Employees By Department
const viewAllByDepartment = () => {
    inquirer.prompt([
        {
        message: "Which department would you like to view the employees from?",
        choices: ["Talent", "Agents", "Marketing", "Legal"],
        name: "department",
        type: "list"
        }
    ]).then((answer) => {
        let query = "SELECT e.first_name, e.last_name, r.title, d.name FROM employee e INNER JOIN role r ON e.role_id = r.id INNER JOIN department d ON r.department_id = d.id WHERE d.name = ?";
        connection.query(query, [answer.department], function (err, res) {
            let table = [];
            for (var i = 0; i < res.length; i++) {
                table.push({ name: res[i].first_name + " " + res[i].last_name, title: res[i].title, department: res[i].name });
            };
            console.log(consoleTable.getTable(table));

            initApplication();
        });
    });
};

//Add an Employee
const addEmployee = () => {
    let query = "SELECT id, first_name, last_name, CONCAT_WS(' ', first_name, last_name) AS managers FROM employee";
    connection.query(query, function (err, res) {
        managers = res;
        addNewEmployee(roles, managers);
    });
    };
    //The prompts for the information needed to add a new employee to the SQL db
    const addNewEmployee = (roles, managers) => {
    //Arrays for the roles listed in the array - used in prompts
    let roleOptions = [];
    let managerOptions = [];
    //for loops to push information to arrays
    for (i = 0; i < roles.length; i++) {
        roleOptions.push(Object.values(roles[i].title).join(""));
    };
    for (i = 0; i < managers.length; i++) {
        managerOptions.push(Object.values(managers[i].managers).join(""));
    };
    //What is prompted to the User
    inquirer.prompt([
        {
        message: "Enter first name of employee:",
        name: "first_name",
        type: "input"
        },
        {
        message: "Enter last name of employee:",
        name: "last_name",
        type: "input"
        },
        {
        message: "Enter employee's role:",
        name: "role_id",
        choices: roleOptions,
        type: "list"
        },
        {
        message: "Who is the employee's manager?",
        name: "manager_id",
        choices: managerOptions,
        type: "list"
        }
    ]).then((res) => {
        let role_id;
        let manager_id;
        //Grabs role_id from assigned role
        for (i = 0; i < roles.length; i++) {
            if (roles[i].title === res.role_id) {
                role_id = roles[i].id;
            };
        };
        for (i = 0; i < managers.length; i++) {
            if (managers[i].managers === res.manager_id) {
                manager_id = managers[i].id;
            };
        };

        let query = "INSERT INTO employee SET ?, ?, ?, ?";
        connection.query(query, [{ first_name: res.first_name }, { last_name: res.last_name }, { role_id: role_id }, { manager_id: manager_id }], function (err, res) {
        if (err) throw err;
        initApplication();
        });
    });
};

//Update an Employee's Role
const updateRole = () => {
    let query = "SELECT id, first_name, last_name, CONCAT_WS(' ', first_name, last_name) AS employees FROM employee";
    connection.query(query, function (err, res) {
        let employee = res;
        updateRolePrompts(roles, employee);
    });
};
//Runs prompts user will see so that we have the needed information to communicate to SQL & make an update
const updateRolePrompts = (roles, employee) => {
    // 
    let listOfEmployees = [];
    let listOfRoles = [];

    for (i = 0; i < employee.length; i++) {
        listOfEmployees.push(Object.values(employee[i].employees).join(""));
    };

    for (i = 0; i < roles.length; i++) {
        listOfRoles.push(Object.values(roles[i].title).join(""));
    };

    inquirer.prompt([
        {
        message: "Select employee for role update:",
        name: "employee",
        type: "list",
        choices: listOfEmployees
        },
        {
        message: "What is the employee's CURRENT role?",
        name: "title",
        type: "list",
        choices: listOfRoles
        }
    ]).then((answers) => {

        let employee_id;
        let role_id;

        // Search by Employee Name
        for (i = 0; i < employee.length; i++) {
            if (employee[i].employees === answers.employee) {
                employee_id = employee[i].id;
            };
        };
        // Search by Employee Role
        for (i = 0; i < roles.length; i++) {
            if (roles[i].title === answers.title) {
                role_id = roles[i].id;
            };
        };

        let query = ("UPDATE employee SET ? WHERE ?");

        connection.query(query, [{ role_id: role_id }, { id: employee_id }], function (err, res) {
            if (err) throw err;
            initApplication();
        });
    });
};
