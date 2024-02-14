/** @format */

require("dotenv").config();
const express = require("express");
const getUsers = require("./utils/getUsers");
const addUser = require("./utils/addUser");

const app = express();
const cors = require("cors");
const port = process.env.PORT || 8080;

const sendEmail = require("./utils/sendEmail");
const getDoc = require("./db/queries/mongo/GET/getDoc");
const addDoc = require("./db/queries/mongo/POST/addDoc");
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.sendStatus(200);
});

/**
 * Route for sending email (contact form and blog signup)
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
app.post("/sendEmail", (req, res) => {
  const formData = req.body;
  sendEmail({ formData });
  res.sendStatus(200);
});

/**
 * Route for getting all blog signups
 * @param {Object} req - The request object (null)
 * @param {Object} res - The response object (data in JSON format)
 */
app.post("/getUsers", async (req, res) => {
  await getUsers(req, res);
});

/**
 * Route for adding a new blog signup
 * @param {Object} req - The request object (contact form data)
 * @param {Object} res - The response object (message, http status code)
 */
app.post("/addUser", async (req, res) => {
  await addUser(req, res);
});

/**
 * Route for getting document from MongoDB
 * @param {Object} req - The request object (id and collection)
 * @param {Object} res - The response object (data/document in JSON format)
 */
app.get("/getDoc", async (req, res) => {
  await getDoc(req, res);
});

/**
 * Route to save document to MongoDB
 * @param {Object} req - The request object (id and data)
 * @param {Object} res - The response object (message, http status code)
 */
app.post("/addDoc/:collection", async (req, res) => {
  console.log("received request body = ", req.body);
  await addDoc(req, res);
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});

module.exports = app;
