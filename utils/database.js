const mongodb = require("mongodb");
const dotenv = require("dotenv").config();
const mongodbClient = mongodb.MongoClient;

const mongodbConnector = () => {
  mongodbClient
    .connect(process.env.MONGODB_URI)
    .then((result) => {
      console.log("Connected to mongodb");
    })
    .catch((err) => console.log(err));
};

module.exports = mongodbConnector;
