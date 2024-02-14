/** @format */
const dns = require("dns");

const { promisify } = require("util");
const dnsResolve = promisify(dns.resolve);
const insertIntoSignupQuery = require("../db/queries/MySQL/POST/insertIntoSignup");

const commonMisspellings = {
  "gamil.com": "gmail.com",
  "gmai.com": "gmail.com",
  "hotamil.com": "hotmail.com",
  "yaho.com": "yahoo.com",
  "yahooo.com": "yahoo.com",
  "outlok.com": "outlook.com",
  "outloo.com": "outlook.com",
};

/**
 * Process email input, check for common misspellings,
 * resolve domain, and insert into blog signup database.
 *
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @return {Promise<void>} Promise that resolves when the function is done
 */
const addUser = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    console.log("received = ", email);
    const domain = email.split("@")[1];
    if (!domain) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    if (commonMisspellings[domain]) {
      return res.status(400).json({
        error: `Did you mean ${email.split("@")[0]}@${commonMisspellings[domain]}?`,
      });
    }
    await dnsResolve(domain);
    await insertIntoSignupQuery({ email });
    return res.status(200).json({ message: "User added successfully" });
  } catch (error) {
    if (error.code === "ENOTFOUND") {
      return res.status(400).json({ error: "Domain not found" });
    } else {
      return res.status(500).json({ error: error.message });
    }
  }
};

module.exports = addUser;
