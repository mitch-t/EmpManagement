USE employees_db;

INSERT INTO department (name) VALUES ("Human Resources");
INSERT INTO department (name) VALUES ("Sales and Marketing");
INSERT INTO department (name) VALUES ("Information Technology");
INSERT INTO department (name) VALUES ("Management");

INSERT INTO role (title, salary, department_id) VALUES ("Data Analyst", 70, 3);
INSERT INTO role (title, salary, department_id) VALUES ("Advertising Associate", 50, 2);
INSERT INTO role (title, salary, department_id) VALUES ("Social Media Manager", 50, 2);
INSERT INTO role (title, salary, department_id) VALUES ("Generalist", 60, 1);
INSERT INTO role (title, salary, department_id) VALUES ("Director", 100, 4);

INSERT INTO employee (first_name, last_name, role_id) VALUES ("Robert", "Myer", 2);
INSERT INTO employee (first_name, last_name, role_id) VALUES ("Amber", "Taylor", 1);
INSERT INTO employee (first_name, last_name, role_id) VALUES ("Katharine", "Perez", 3);
INSERT INTO employee (first_name, last_name, role_id) VALUES ("Raquel", "Smith", 4);
INSERT INTO employee (first_name, last_name, role_id) VALUES ("Larry", "Harp", 5);
