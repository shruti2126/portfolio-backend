/** @format */

const conn = require("../../dbConn");

const result = conn.query(
  "SELECT * FROM users",
  function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  }
);
module.exports = result;
