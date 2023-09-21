/** @format */

const connection = require("./dbConfig");

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("Connection to database established.");
});
module.exports = connection;
