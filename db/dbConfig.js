/** @format */

const mysql = require("mysql");

// Create a connection object
const connection = mysql.createConnection({
  host: "localhost:3306",
  user: "root",
  password: "",
  database: "blog",
});

module.exports = connection;
