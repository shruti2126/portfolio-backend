/** @format */

const pool = require("../../dbConfig");

const executeQuery = async (email) => {
  if (email !== undefined) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          reject(err);
          return;
        }

        const sqlQuery = `INSERT INTO signup (email) VALUES ('${email}')`;

        connection.query(sqlQuery, (error, results, fields) => {
          connection.release();
          if (error) {
            reject(error);
            return;
          }
          resolve(results);
        });
      });
    });
  }
};

module.exports = executeQuery;
