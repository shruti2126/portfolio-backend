const cors = require("cors");

const allowedOrigins = [
  "https://shrucodes.com",
  "https://shrucodes.com/",
];


/**
 * Checks if the provided origin is allowed, and calls the callback accordingly.
 *
 * @param {string} origin - The origin to be checked
 * @param {Function} callback - The callback function to be called
 * @return {void}
 */
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
  credentials: true,
};

module.exports = cors(corsOptions);
