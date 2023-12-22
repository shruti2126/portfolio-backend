/** @format */

const pool = require("../../../config/mysql/dbConfig");

const executeQuery = async ({ email }) => {
  if (!email) {
    throw new Error("Email is undefined");
  }
  const connection = await pool.getConnection();
  try {
    const checkEmailQuery = `SELECT * FROM signup WHERE email = ?`;
    const [results] = await connection.query(checkEmailQuery, [email]);
    if (results.length > 0) {
      throw new Error("Email already exists");
    }
    const insertQuery = `INSERT INTO signup (email) VALUES (?)`;
    const [insertResults] = await connection.query(insertQuery, [email]);
    return insertResults;
  } catch (error) {
    console.log(error);
    return error;
  } finally {
    connection.release();
  }
};

module.exports = executeQuery;
