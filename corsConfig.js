/** @format */
const cors = require('cors');
cors({
  origins: ["http://localhost:3000", "https://shrutis.io"],
  methods: "GET, POST, PUT, DELETE",
  allowedHeaders: "Content-Type",
  credentials: true,
});

module.exports = cors;