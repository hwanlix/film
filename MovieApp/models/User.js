import { ObjectId } from 'mongodb';
import db from '../database.js';
const { getDatabase } = db;

const COLLECTION_NAME = 'users';

class User {
  constructor({ username, password }) {
    this.username = username;
    this.password = password;
  }

  static async findByUsername(username) {
    const db = getDatabase();
    return await db.collection(COLLECTION_NAME).findOne({ username });
  }

  static async create({ username, password }) {
    const db = getDatabase();
    const result = await db.collection(COLLECTION_NAME).insertOne({ username, password });
    return { _id: result.insertedId, username, password };
  }

  static async findById(id) {
    const db = getDatabase();
    return await db.collection(COLLECTION_NAME).findOne({ _id: ObjectId(String(id)) });
  }
}

export default User;
