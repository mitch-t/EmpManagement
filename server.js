const mysql = require("mysql");
const inquirer = require("inquirer");
require("console.table");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Brontoe13",
  database: "employees_DB",
});

// connect to the mysql server and sql database
connection.connect(function (err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

// function which prompts the user for what action they should take
function start() {
  inquirer
    .prompt({
      name: "startq",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View Departments",
        "View Employee roles",
        "Add Employee",
        "Add Department",
        "Add Role",
        //"Remove Employee",
        "Update Employee Role",
        // "Update Employee Manager",
        "Quit",
      ],
    })
    .then(function (answer) {
      // based on user choice
      if (answer.startq === "View All Employees") {
        viewAll();
      } else if (answer.startq === "View Departments") {
        viewDepartments();
      } else if (answer.startq === "View Employee roles") {
        viewRoles();
      } else if (answer.startq === "Add Employee") {
        addEmployee();
      } else if (answer.startq === "Add Department") {
        addDepartment();
      } else if (answer.startq === "Add Role") {
        addRole();
      } else if (answer.startq === "Remove Employee") {
        removeEmployee();
      } else if (answer.startq === "Update Employee Role") {
        updateRole();
      } else if (answer.startq === "Update Employee Manager") {
        updateManager();
      } else {
        connection.end();
      }
    });
}
function viewAll() {
  var query = "SELECT * FROM employee";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
  });
  start();
}

function viewDepartments() {
  var query = "SELECT * FROM department";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
  });
  start();
}

function viewRoles() {
  var query = "SELECT * FROM role";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
  });
  start();
}

function addDepartment() {
  inquirer
    .prompt({
      name: "department",
      type: "input",
      message: "What is the name of the new department?",
    })
    .then(function (answer) {
      var query = "INSERT INTO department (name) VALUES ( ? )";
      connection.query(query, answer.department, function (err, res) {
        if (err) throw err;
        // console.table(res);
      });
      viewDepartments();
    });
}

function addRole() {
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "What is the title of the new role?",
        },
        {
          name: "salary",
          type: "input",
          message: "What is the salary of the new role?",
        },
        {
          name: "departmentN",
          type: "list",
          message: "Which department does this role fall under?",
          choices: function () {
            var choicesArray = [];
            res.forEach((res) => {
              choicesArray.push(res.name);
            });
            return choicesArray;
          },
        },
      ])

      //  get the id from the departments table
      .then(function (answer) {
        const department = answer.departmentN;
        connection.query("SELECT * FROM department", function (err, res) {
          if (err) throw err;
          let filteredDept = res.filter(function (res) {
            return res.name == department;
          });
          let id = filteredDept[0].id;
          let query =
            "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)";
          let values = [answer.title, parseInt(answer.salary), id];
          console.log(values);

          connection.query(query, values, function (err, res, fields) {
            console.log(`You have added this role: ${values[0]}.`);
          });
          viewRoles();
        });
      });
  });
}
// function to handle posting new employees
function addEmployee() {
  connection.query("SELECT * FROM role", function (err, result) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "first",
          type: "input",
          message:
            "What is the first name of the employee you would like to add?",
        },
        {
          name: "last",
          type: "input",
          message:
            "What is the last name of the employee you would like to add?",
        },
        {
          name: "roleName",
          type: "list",
          message: "What is the role of this employee?",
          choices: function () {
            rolesArray = [];
            result.forEach((result) => {
              rolesArray.push(result.title);
            });
            return rolesArray;
          },
        },
      ])

      .then(function (answer) {
        console.log(answer);
        const role = answer.roleName;
        connection.query("SELECT FROM * role", function (err, res) {
          if (err) throw err;

          let filteredRole = res.filter(function (res) {
            return res.title == role;
          });
          let roleId = filteredRole[0].id;
          connection.query("SELECT * FROM employee", function (err, res) {
            inquirer
              .prompt([
                {
                  name: "manager",
                  type: "list",
                  message: "What is the last name of your manager?",
                  choices: function () {
                    managersArray = [];
                    res.forEach((res) => {
                      managersArray.push(res.last_name);
                    });
                    return managersArray;
                  },
                },
              ])
              .then(function (managerAnswer) {
                const manager = managerAnswer.manager;
                connection.query("SELECT * FROM employee", function (err, res) {
                  if (err) throw err;
                  let filteredManager = res.filter(function (res) {
                    return res.last_name == manager;
                  });
                  let managerId = filteredManager[0].id;
                  console.log(managerAnswer);
                  let query =
                    "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
                  let values = [answer.first, answer.last, roleId, managerId];
                  console.log(values);
                  connection.query(query, values, function (err, res, fields) {
                    console.log("Your employee was created successfully!");
                  });
                  viewAll();
                });
              });
          });
        });
      });
  });
}
function updateRole() {
  connection.query("SELECT * FROM employee", function (err, result) {
    if (err) throw err;
    // prompt for info about the name of the employee being UPDATED might need ID?
    inquirer
      .prompt([
        {
          name: "employeeN",
          type: "list",
          message: "Choose the employee you would like to update.",
          choices: function () {
            employeeArray = [];
            result.forEach((result) => {
              employeeArray.push(result.last_name);
            });
            return employeeArray;
          },
        },
      ])

      .then(function (answer) {
        console.log(answer);
        const name = answer.employeeN;
        connection.query("SELECT * FROM role", function (err, res) {
          inquirer
            .prompt([
              {
                name: "role",
                type: "list",
                message: "What is the employees new role?",
                choices: function () {
                  rolesArray = [];
                  res.forEach((res) => {
                    rolesArray.push(res.title);
                  });
                  return rolesArray;
                },
              },
            ])
            .then(function (rolesAnswer) {
              const role = rolesAnswer.role;
              console.log(rolesAnswer.role);
              connection.query(
                "SELECT * FROM role WHERE title = ?",
                [role],
                function (err, res) {
                  if (err) throw err;
                  let roleId = res[0].id;
                  let query = "UPDATE employee SET role_id ? WHERE last_name ?";
                  let values = [roleId, name];
                  console.log(values);
                  connection.query(query, values, function (err, res, fields) {
                    console.log("You have updated your employees role.");
                  });
                  viewAll();
                }
              );
            });
        });
      });
  });
}
