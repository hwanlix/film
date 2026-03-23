import { MongoClient as _MongoClient } from "mongodb";
const MongoClient = _MongoClient;
import { config } from "dotenv";

config();

let database;

const mongoConnect = (callback) => {
  MongoClient.connect(process.env.MONGO_URI)
    .then((client) => {
      console.log("Connected!");
      database = client.db("movies_api");
      callback();
    })
    .catch((error) => console.log(error));
};

const getDatabase = () => {
  if (!database) {
    throw "No database found!";
  }

  return database;
};

export default { mongoConnect, getDatabase };