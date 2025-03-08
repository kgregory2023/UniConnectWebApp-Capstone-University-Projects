const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config({ path: "./config.env" });

const client = new MongoClient(process.env.AURI, {
  serverApi: ServerApiVersion.v1,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let database;

const connectToServer = async () => {
  try {
    await client.connect();
    database = client.db("UnIConnect");
    console.log("MongoDB Connected Successfully using MongoClient!");
  } catch (error) {
    console.error("MongoDB Connection Failed!", error);
    process.exit(1);
  }
};

const getDB = () => database;

module.exports = { connectToServer, getDB };