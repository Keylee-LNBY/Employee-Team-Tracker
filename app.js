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

//View All Employees By Department

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
