const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

// The Server can be stopped again with

const connect = async () => {
  let mongodb;
  try {
    // This will create an new instance of "MongoMemoryServer" and automatically start it
    mongodb = await MongoMemoryServer.create();
    const getUri = mongodb.getUri();
    // Connect to the MongoDB instance

    mongoose.set('strictQuery', false);
    const db = await mongoose.connect(getUri);
    console.log("Database Connected");
    return db;
  } catch (error) {}
  console.log("Database Connected");
  return db;
};

module.exports = connect;
