/** @format */

const getAllSignup = require("../db/queries/MySQL/GET/getAllSignup");

/**
 * Handle the request to get all blog signups
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const getUsers = async (req, res) => {
  try {
    // Get all signups
    const result = await getAllSignup();
    // Send the result in the response
    return res.status(200).json(result);
  } catch (error) {
    // Send error message in case of an error
    return res.status(500).json({ error: error.message });
  }
};

module.exports = getUsers;
