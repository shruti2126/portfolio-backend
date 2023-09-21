/** @format */

const pool = require("../../dbConfig");

const executeQuery = async () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }

      connection.query("SELECT * FROM users", (error, results, fields) => {
        connection.release();
        if (error) {
          reject(error);
          return;
        }
        resolve(results);
      });
    });
  });
};

module.exports = executeQuery;
