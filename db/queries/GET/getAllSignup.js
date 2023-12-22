/** @format */

const pool = require("../../../config/mysql/dbConfig");

const executeQuery = async () => {
  const connection = await pool.getConnection();
 try {
   const query = "SELECT * FROM signup";
   const [results] = await connection.query(query);
   if (results.length === 0) {
     throw new Error("No Rows in table yet.");
   }
   return results;
 } catch (error) {
    return {error}
 } finally {
   connection.release();
 }
     
    
};

module.exports = executeQuery;
