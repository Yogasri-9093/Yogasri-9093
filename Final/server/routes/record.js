import express from "express";

// This will help us connect to the database
import db from "../db/connection.js";

// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";

// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const router = express.Router();

// This section will help you get a list of all the records.
router.get("/", async (req, res) => {
  let collection = await db.collection("records");
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});

// This section will help you get a single record by id
router.get("/:id", async (req, res) => {
  let collection = await db.collection("records");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// This section will help you create a new record.
router.post("/", async (req, res) => {
  try {
    let newDocument = {
      name: req.body.name,
      position: req.body.position,
      level: req.body.level,
    };
    let collection = await db.collection("records");
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding record");
  }
});

// This section will help you update a record by id.
router.patch("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        name: req.body.name,
        position: req.body.position,
        level: req.body.level,
      },
    };

    let collection = await db.collection("records");
    let result = await collection.updateOne(query, updates);
    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating record");
  }
});

// This section will help you delete a record
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    const collection = db.collection("records");
    let result = await collection.deleteOne(query);

    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting record");
  }
});


// This section will help you search for records.
router.get("/:search", async (req, res) => {
  try {
    const { name, position, level } = req.query;
    let query = {};

    if (name) {
      query.name = { $regex: name, $options: "i" }; // Case-insensitive search
    }
    if (position) {
      query.position = { $regex: position, $options: "i" };
    }
    if (level) {
      query.level = { $regex: level, $options: "i" };
    }

    let collection = await db.collection("records");
    let results = await collection.find(query).toArray();

    res.send(results).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error searching records");
  }
});

router.get("/", async (req, res) => {
  try {
    // Check the MongoDB connection
    if (!db) {
      throw new Error("Database connection not established.");
    }

    let collection = await db.collection("records");

    // Extract filter criteria from query parameters
    const { name, position, level } = req.query;
    console.log("Query parameters:", { name, position, level });

    // Build the query object based on the provided filters
    let query = {};
    if (name) query.name = { $regex: name, $options: 'i' }; // Case-insensitive search
    if (position) query.position = { $regex: position, $options: 'i' };
    if (level) query.level = level;

    console.log("MongoDB query:", query);

    let results = await collection.find(query).toArray();
    res.status(200).send(results);
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).send("Error fetching records");
  }
});


export default router;
