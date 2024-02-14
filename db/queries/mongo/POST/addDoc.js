/** @format */

const mongo = require("../../../../config/mongo/conn");
const { ObjectId } = require("mongodb");
/**
 * Save document to MongoDB using id and collection from request parameters.
 *
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @return {Promise} a Promise that resolves to the saved document or rejects with an error
 */
module.exports = async (req, res) => {
  try {
    // Extract collection from route parameters
    const { collection } = req.params;
    console.log(
      "received request body = ",
      req.body,
      "query params = ",
      collection
    );
    //Generate objectId for document manually
    const objectId = ObjectId.createFromTime(Math.floor(Date.now() / 1000));
    console.log(
      "Saving document to MongoDB with id:",
      objectId,
      "in collection:",
      collection
    );

    // Save the document to the specified collection using the id
    const doc = await mongo
      .db("portfolio")
      .collection(collection)
      .insertOne({
        _id: objectId,
        ...req.body,
      });

    console.log("DOC = ", doc);
    return res.status(200).send("Document saved successfully");
  } catch (error) {
    console.error("Error retrieving document:", error);
    return res.status(500).send(error.message);
  }
};
