/** @format */

const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "blog",
  connectionLimit: 10, // Adjust this as needed
});

module.exports = pool;
