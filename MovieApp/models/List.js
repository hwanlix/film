import { getDatabase } from "../database";

const COLLECTION_NAME = "movies_lists";

class List {
  constructor(name) {
    this.name = name;
    this.movies = [];
  }

  static async getAll() {
    const db = getDatabase();

    try {
      const lists = await db.collection(COLLECTION_NAME).find({}).toArray();

      return lists;
    } catch (error) {
      console.error("Error occurred while searching for all lists");

      return [];
    }
  }

  static async add(list) {
    const db = getDatabase();

    try {
      await db.collection(COLLECTION_NAME).insertOne(list);
    } catch (error) {
      console.error("Error occurred while adding list");
    }
  }

  static async findByName(name) {
    const db = getDatabase();

    try {
      const searchedList = await db
        .collection(COLLECTION_NAME)
        .findOne({ name });

      return searchedList;
    } catch (error) {
      console.error("Error occurred while searching list");

      return null;
    }
  }

  static async deleteByName(name) {
    const db = getDatabase();

    try {
      await db.collection(COLLECTION_NAME).deleteOne({ name });
      //await deleteListByName(name)
    } catch (error) {
      console.error("Error occurred while deleting list");
    }
  }

  static async getLast() {
    const db = getDatabase();

    try {
      const lastAddedList = await db
        .collection(COLLECTION_NAME)
        .find({})
        .sort({ _id: -1 })
        .limit(1)
        .toArray()
        .then((docs) => docs[0]);

      return lastAddedList;
    } catch (error) {
      console.error("Error occurred while searching for last list");

      return null;
    }
  }
}

export default List;
