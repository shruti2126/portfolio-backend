/** @format */
const conn = require("../../dbConn");

const result = conn.query(
  'INSERT INTO users (email, username) VALUES ("ss.sharma1826@gmail.com", "shru")',
  function (error, results, fields) {
    if (error) throw error;
    console.log("result object : ", results);
  }
);


module.exports = result;
