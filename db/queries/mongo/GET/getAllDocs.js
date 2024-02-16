/** @format */

const mongo = require("../../../../config/mongo/conn");

/**
 * Fetches all documents from the specified collection.
 *
 * @param {string} collectionName - The name of the collection to fetch documents from.
 * @return {Promise<Array>} The array of documents fetched from the collection.
 */
async function fetchAllDocuments(req, res) {
  const collectionName = req.params.collection;
  console.log("collection name = ", collectionName);
  try {
    const documents = await mongo
      .db("portfolio")
      .collection(collectionName)
      .find().toArray();
    return res.json(documents);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
module.exports = fetchAllDocuments;
