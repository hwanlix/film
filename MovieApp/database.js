import { MongoClient as _MongoClient } from "mongodb";
const MongoClient = _MongoClient;

let database;

const mongoConnect = (callback) => {
  MongoClient.connect(`mongodb+srv`)
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
