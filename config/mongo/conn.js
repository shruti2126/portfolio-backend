/** @format */

const { MongoClient, ServerApiVersion } = require("mongodb");

const password = encodeURIComponent(`${process.env.MONGO_PASS}`);
const uri = `mongodb+srv://shruti:${password}@portfolio-website.1jbp5dy.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const mongo = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

/**
 * Asynchronous function to connect the client to the server.
 * Ensures that the client will close when you finish/error
 *
 * @return {Promise<void>} A Promise that resolves when the function execution is complete
 */
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    console.log("Connecting to MongoDB...");
    await mongo.connect();
    // Send a ping to confirm a successful connection
    await mongo.db("Portfolio-Website").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (err) {
    console.error(err);
  }
}
run().then(() => console.log("MongoDB Connected"));

module.exports = mongo;
