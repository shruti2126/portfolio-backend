/** @format */
require("dotenv").config();
const mysql = require("mysql2");
const dbInstance = process.env.RDS_INSTANCE;
const password = process.env.RDS_PASS;

const pool = mysql.createPool({
  host: dbInstance,
  user: "Shruti",
  password: password,
  database: "blog",
  connectionLimit: 10, // Adjust this as needed
});

module.exports = pool;
