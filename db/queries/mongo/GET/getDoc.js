/** @format */

const { client: mongo } = require("../../../../config/mongo/conn");
const { ObjectId } = require("mongodb");
/**
 * Retrieves a document from MongoDB by its id using a GET request
 *
 * @param {*} req - Request parameters from the client
 * @param {*} res - Response sent back to the client
 */
module.exports = async (req, res) => {
  try {
    // Extract id and collection from request parameters
    const { id, collection } = req.query;
    //Generate objectId for document manually
    const objectId = ObjectId.createFromTime(Math.floor(Date.now() / 1000));
    console.log(
      "Retrieving document from MongoDB with id:",
      id,
      "in collection:",
      collection
    );

    // Find the document in the specified collection using the id
    const doc = await mongo
      .db("Portfolio-Website")
      .collection(collection)
      .findOne({ _id: objectId });

    if (!doc) {
      console.log("Document not found");
      res.status(404).send("Document not found");
      return;
    }

    console.log("Sending retrieved document back to the client:", doc);
    // Send the retrieved document back to the client
    return res.send({ document: doc });
  } catch (error) {
    console.error("Error retrieving document:", error);
    return res.status(500).send(error.message);
  }
};
