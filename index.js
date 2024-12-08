/** @format */

require("dotenv").config();
const express = require("express");
const getUsers = require("./utils/getUsers");
const addUser = require("./utils/addUser");
const cors = require("./config/cors/corsConfig");
const sendEmail = require("./utils/sendEmail");

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cors);

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.path}`);
  next();
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is up and running" });
});

/**
 * Route for sending email (contact form and blog signup)
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
app.post("/sendEmail", async (req, res) => {
  console.log("here...");
  const { formData } = req.body;
  console.log("Form data:", formData);

  try {
    const result = await sendEmail({ formData });
    if (result === "success") {
      res.status(200).json({ message: "Email sent successfully" });
    } else {
      res.status(500).send("Error sending email");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

/**
 * Route for getting all blog signups
 * @param {Object} req - The request object (null)
 * @param {Object} res - The response object (data in JSON format)
 */
app.post("/getUsers", async (req, res) => {
  await getUsers(req, res);
});


// Endpoint to fetch the latest resume link
app.get("/resume", async (req, res) => {
  try {
    // Authenticate with service account
    const auth = new google.auth.GoogleAuth({
      keyFile: "./google-drive-key.json", // Path to your JSON key file
      scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    });

    const drive = google.drive({ version: "v3", auth });

    // Query for the latest resume
    const response = await drive.files.list({
      q: "name contains 'ResumeShrutSharma'", // Adjust to match your file name
      fields: "files(id, name, webViewLink)",
      orderBy: "modifiedTime desc",
      pageSize: 1,
    });

    if (response.data.files.length) {
      const file = response.data.files[0];
      res.json({ link: file.webViewLink }); // Return the link to the frontend
    } else {
      res.status(404).json({ error: "No resume found." });
    }
  } catch (error) {
    console.error("Error fetching resume:", error);
    res.status(500).json({ error: "Failed to fetch resume." });
  }
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
 * Route for getting all documents from MongoDB
 * @param {Object} req - The request object (collection name)
 * @param {Object} res - The response object (data in JSON format)
 */
app.get("/getAllDocs/:collection", async (req, res) => {
  await fetchAllDocuments(req, res);
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

// app.listen(port, () => {
//   console.log(`Server is running on ${port}`);
// });

module.exports = app;
