//need to add join to combine tables

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
  startIcon();
  start();
});
function startIcon() {

 let icon = `
      $$$$$$$                                                   $$$$$$                                                  
      $       $    $ $$$$$  $       $$$$  $   $ $$$$$$ $$$$$$    $    $    $$   $$$$$   $$   $$$$$    $$    $$$$  $$$$$$ 
      $       $$  $$ $    $ $      $    $  $ $  $      $         $     $  $  $    $    $  $  $    $  $  $  $      $      
      $$$$$   $ $$ $ $    $ $      $    $   $   $$$$$  $$$$$     $     $ $    $   $   $    $ $$$$$  $    $  $$$$  $$$$$  
      $       $    $ $$$$$  $      $    $   $   $      $         $     $ $$$$$$   $   $$$$$$ $    $ $$$$$$      $ $      
      $       $    $ $      $      $    $   $   $      $         $     $ $    $   $   $    $ $    $ $    $ $    $ $      
      $$$$$$$ $    $ $      $$$$$$  $$$$    $   $$$$$$ $$$$$$    $$$$$$  $    $   $   $    $ $$$$$  $    $  $$$$  $$$$$$ 
  `;

  console.log(icon); 
}
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
        "View Employee Roles",
        "Add Employee",
        "Add Department",
        "Remove Department",
        "Add Role",
        "Remove Role",
        "Remove Employee",
        "Update Employee Role",
        // "Update Employee Manager",
        "Quit",
      ],
    })
    .then(function (answer) {
      switch (answer.startq) {
        case "View All Employees":
          viewAll();
          break;
        case "View Departments":
          viewDepartments();
          break;
        case "View Employee Roles":
          viewRoles();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Add Department":
          addDepartment();
        case "Remove Department":
          deleteDept(); 
          break;
        case "Add Role":
          addRole();
          break;
        case "Remove Role":
          deleteRole();
          break; 
        case "Update Employee Role":
          updateRole();
          break;
        case "Remove Employee":
          deleteEmp();
          break;
        case "Quit":
          menu();
          break;
      }
    });
}

function menu() {
  inquirer
    .prompt([
      {
        name: "menu",
        type: "input",
        message: "Press ENTER to return to the menu or type QUIT.",
      },
    ])
    .then(function (answer) {
      if (answer.menu === "") {
        start();
      } else if (answer.menu === "QUIT") {
        console.log("Thank you for using the employee tracker!");
        connection.end();
      } else {
        menu();
      }
    });
}

function viewAll() {
  connection.query( "SELECT employee.*, role.title, role.salary, department.name FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id ORDER BY employee.id",(err, res) => {
    if (err) throw err;
    console.table(res);
    menu();
  });
}

function viewDepartments() {
  connection.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;
    console.table(res);
    menu();
  });
}

function viewRoles() {
  connection.query("SELECT * FROM role", (err, res) => {
    if (err) throw err;
    console.table(res);
    menu();
  });
}

function addDepartment() {
  inquirer
    .prompt({
      name: "department",
      type: "input",
      message: "What is the name of the new department?",
    })
    .then(function (answer) {
      connection.query(
        "INSERT INTO department SET ?",
        {
          name: answer.department,
        },
        function (err) {
          if (err) throw err;
          console.log(`${answer.department} was created successfully!`);
          // console.table(res);
        }
      );
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
            let choicesArray = [];
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

          connection.query(query, values, function (err, res, fields) {
            console.log(`You have added ${values[0]} as a role.`);
          });
          viewRoles();
        });
      });
  });
}
function deleteEmp() {
  let employeesArray = [];
  connection.query("SELECT * FROM employee", function (err, results) {
      for (let i = 0; i < results.length; i++) {
          let employee = results[i]
          employeesArray.push(employee)
      }
      console.table(employeesArray);
      inquirer.prompt(
          [{
              name: "delete",
              type: "input",
              message: "Enter the ID number of the employee you would like to delete?",
          }]).then(function (answer) {
              let deletedEmp = answer.delete
              connection.query("DELETE FROM employee WHERE id = ?", deletedEmp, function (err, results) {
                  if (err) throw err;
              })
              menu();
          })
  });
}

function deleteDept() {
  let departmentsArray = [];
  connection.query("SELECT * FROM department", function (err, results) {
      for (let i = 0; i < results.length; i++) {
          let department = results[i]
          departmentsArray.push(department)
      }
      console.table(departmentsArray);
      inquirer.prompt(
          [{
              name: "delete",
              type: "input",
              message: "Enter the department ID you would like to delete?",
          }]).then(function (answer) {
              let deletedDept = answer.delete
              connection.query("DELETE FROM department WHERE id = ?", deletedDept, function (err, results) {
                  if (err) throw err;
              })
              menu();
          })
  });
}

function deleteRole() {
  let rolesArray = [];
  connection.query("SELECT * FROM role", function (err, results) {
      for (let i = 0; i < results.length; i++) {
          let role = results[i]
          rolesArray.push(role)
      }
      console.table(rolesArray);
      inquirer.prompt(
          [{
              name: "delete",
              type: "input",
              message: "Enter the role ID you would like to delete?",
          }]).then(function (answer) {
              let deletedRole = answer.delete
              connection.query("DELETE FROM role WHERE id = ?", deletedRole, function (err, results) {
                  if (err) throw err;
              })
              menu();
          })
  });
}
// function to handle posting new employees 
function addEmployee() {
  connection.query("SELECT * FROM role", function (err, result) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "firstName",
          type: "input",
          message: "What is the employee's first name?",
        },
        {
          name: "lastName",
          type: "input",
          message: "What is the employee's last name?",
        },
        {
          name: "roleName",
          type: "list",
          message: "What role does the employee have?",
          choices: function () {
            rolesArray = [];
            result.forEach((result) => {
              rolesArray.push(result.title);
            });
            return rolesArray;
          },
        },
      ])
      // connect new employee to manager and ID
      .then(function (answer) {
        console.log(answer);
        const role = answer.roleName;
        connection.query("SELECT * FROM role", function (err, res) {
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
                  message: "Who is your manager?",
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
                  let values = [
                    answer.firstName,
                    answer.lastName,
                    roleId,
                    managerId,
                  ];
                  //  console.log(values);
                  connection.query(query, values, function (err, res, fields) {
                    console.log(`You have added this employee: ${values[0]}.`);
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
    // prompt for info about the name of the employee being UPDATED by last name
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
                 // console.log(values);
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

