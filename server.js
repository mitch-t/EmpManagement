const mysql = require("mysql");
const inquirer = require("inquirer");
require("console.table");

//const express = require("express");
//const app = express();

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
        "Remove Employee",
        "Update Employee Role",
        "Update Employee Manager",
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
        console.table(res);
      });
      viewDepartments();
    });
}

// function to handle posting new employees
function addEmployee() {
  // prompt for info about the name of the employee being added
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
        message: "What is the last name of the employee you would like to add?",
      },
      {
        name: "roleName",
        type: "input",
        message: "What is the role of this employee?",
      },
    ])
    //need to add manager questions
    .then(function (answer) {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: answer.first,
          last_name: answer.last,
          role_id: answer.roleName,
        },
        function (err) {
          if (err) throw err;
          console.log("Your employee was created successfully!");
          viewAll();
          // re-prompt the user to the start menu
          start();
        }
      );
    });
}
function addRole() {
  connection.query('SELECT * FROM department', function(err, res) {
      if (err) throw (err);
  inquirer
      .prompt([{
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
          name: "departmentName",
          type: "list",
          message: "Which department does this role fall under?",
          choices: function() {
              var choicesArray = [];
              res.forEach(res => {
                  choicesArray.push(
                      res.name
                  );
              })
              return choicesArray;
            }
        }
        ]) 

//  get the id from the departments table 
      .then(function(answer) {
      const department = answer.departmentName;
      connection.query('SELECT * FROM DEPARTMENT', function(err, res) {
      
          if (err) throw (err);
       let filteredDept = res.filter(function(res) {
          return res.name == department;
      }
      )
      let id = filteredDept[0].id;
     let query = "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)";
     let values = [answer.title, parseInt(answer.salary), id]
     console.log(values);
      connection.query(query, values,function (_err, _res, _fields) {
          console.log(`You have added this role: ${(values[0]).toUpperCase()}.`)
      })
          viewRoles()
          })
      })
  })
}

function removeEmployee() {
  // prompt for info about the name of the employee being deleted might need ID?
  inquirer
    .prompt([
      {
        name: "first",
        type: "input",
        message:
          "What is the first name of the employee you would like to remove?",
      },
      {
        name: "last",
        type: "input",
        message:
          "What is the last name of the employee you would like to remove?",
      },
    ])
    //need to add role and manager questions
    .then(function (answer) {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        "DELETE FROM employee SET ?",
        {
          first_name: answer.first,
          last_name: answer.last,
          role_id: answer.role,
          manager_id: answer.manager,
        },
        function (err) {
          if (err) throw err;
          console.log("Your employee was removed successfully!");
          // re-prompt the user for if they want to bid or post
          start();
        }
      );
    });
}

function updateRole() {
  // prompt for info about the name of the employee being UPDATED might need ID?
  inquirer
    .prompt([
      {
        name: "first",
        type: "input",
        message:
          "What is the first name of the employee you would like to remove?",
      },
      {
        name: "last",
        type: "input",
        message:
          "What is the last name of the employee you would like to remove?",
      },
    ])
    //need to add role and manager questions
    .then(function (answer) {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        "UPDATE employee SET ? WHERE ?",
        [{ role_id: answer.role }, { last_name: answer.last }],
        function (err) {
          if (err) throw err;
          console.log("Your employee role has been updated successfully!");
          // re-prompt the user to the start menu
          start();
        }
      );
    });
}
