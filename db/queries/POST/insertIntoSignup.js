/** @format */

// /** @format */

// const pool = require("../../dbConfig");

// const executeQuery = async (email) => {
//   if (email !== undefined) {
//     return new Promise((resolve, reject) => {
//       pool.getConnection((err, connection) => {
//         if (err) {
//           reject(err);
//           return;
//         }

//         // New query to check if email already exists
//         const checkEmailQuery = `SELECT * FROM signup WHERE email = '${email}'`;

//         connection.query(checkEmailQuery, (error, results, fields) => {
//           if (error) {
//             connection.release();
//             reject(error);
//             return;
//           }
//           if (results.length > 0) {
//             connection.release();
//             // Reject if email already exists
//             reject(new Error("Email already exists"));
//             return;
//           }

//           // If email does not exist, insert it
//           const insertQuery = `INSERT INTO signup (email) VALUES ('${email}')`;
//           connection.query(insertQuery, (insertError, insertResults) => {
//             connection.release();
//             if (insertError) {
//               reject(insertError);
//               return;
//             }
//             resolve(insertResults);
//           });
//         });
//       });
//     });
//   }
// };

// module.exports = executeQuery;
const pool = require("../../../config/mysql/dbConfig");

const executeQuery = async (email) => {
  if (email === undefined) {
    throw new Error("Email is undefined");
  }

  const connection = await pool.getConnection();
  try {
    // Use parameterized queries to prevent SQL Injection
    const checkEmailQuery = `SELECT * FROM signup WHERE email = ?`;
    const [results] = await connection.query(checkEmailQuery, [email]);

    if (results.length > 0) {
      throw new Error("Email already exists");
    }

    const insertQuery = `INSERT INTO signup (email) VALUES (?)`;
    const [insertResults] = await connection.query(insertQuery, [email]);
    return insertResults;
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = executeQuery;
