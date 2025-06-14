import { ObjectId } from 'mongodb';
import db from '../database.js';
const { getDatabase } = db;

const COLLECTION_NAME = 'movies_lists';

class List {
  constructor(name, userId) {
    if (!ObjectId.isValid(userId)) {
      throw new Error('Invalid userId');
    }

    this.name = name;
    this.userId = new ObjectId(String(userId));
    this.movies = [];
  }


  static async getAll(userId) {
    const db = getDatabase();
    try {
      if (!ObjectId.isValid(userId)) {
        throw new Error('Invalid userId');
      }
      return await db.collection(COLLECTION_NAME).find({ userId: new ObjectId(String(userId))}).toArray();
    } catch (error) {
      console.error('Error while fetching all lists:', error);
      return [];
    }
  }

  static async findByName(name, userId) {
    const db = getDatabase();
    try {
      if (!ObjectId.isValid(userId)) {
        throw new Error('Invalid userId');
      }
      return await db.collection(COLLECTION_NAME).findOne({ name, userId: new ObjectId(String(userId)) });
    } catch (error) {
      console.error('Error while finding list by name:', error);
      return null;
    }
  }

  static async add(list) {
    const db = getDatabase();
    try {
      if (!ObjectId.isValid(list.userId)) {
        throw new Error('Invalid userId');
      }
      if (!list || !list.name || !list.userId) {
        throw new Error('Invalid list object passed to add()');
      }
      const exists = await this.findByName(list.name, list.userId);
      if (!exists) {
        await db.collection(COLLECTION_NAME).insertOne(list);
      }
    } catch (error) {
      console.error('Error while adding list:', error);
    }
  }

  static async deleteByName(name, userId) {
    const db = getDatabase();
    try {
      if (!ObjectId.isValid(userId)) {
        throw new Error('Invalid userId');
      }
      await db.collection(COLLECTION_NAME).deleteOne({ name, userId: new ObjectId(String(userId)) });
    } catch (error) {
      console.error('Error while deleting list:', error);
    }
  }

  static async getLast() {
    const db = getDatabase();
    try {
      const result = await db
        .collection(COLLECTION_NAME)
        .find({})
        .sort({ _id: -1 })
        .limit(1)
        .toArray();
      return result[0] || null;
    } catch (error) {
      console.error('Error while getting last list:', error);
      return null;
    }
  }


  static async addMovieToList(listName, userId, movie) {
    const db = getDatabase();
    try {
      if (!ObjectId.isValid(userId)) {
        throw new Error('Invalid userId');
      }
      // Only add if not already in the list
      await db.collection(COLLECTION_NAME).updateOne(
        { name: listName, userId: new ObjectId(String(userId)), 'movies.id': { $ne: movie.id } },
        { $push: { movies: movie } }
      );
    } catch (error) {
      console.error('Error while adding movie:', error);
    }
  }

  static async deleteMovieFromList(listName, userId, movieId) {
    const db = getDatabase();
    try {
      if (!ObjectId.isValid(userId)) {
        throw new Error('Invalid userId');
      }
      await db.collection(COLLECTION_NAME).updateOne(
        { name: listName, userId: new ObjectId(String(userId)) },
        { $pull: { movies: { id: movieId } } }
      );
    } catch (error) {
      console.error('Error while removing movie:', error);
    }
  }

  static async getMovies(listName, userId) {
    const db = getDatabase();
    try {
      if (!ObjectId.isValid(userId)) {
        throw new Error('Invalid userId');
      }
      const list = await db.collection(COLLECTION_NAME).findOne({ name: listName, userId: new ObjectId(String(userId)) });
      return list?.movies || [];
    } catch (error) {
      console.error('Error while getting movies:', error);
      return [];
    }
  }
}

export default List;
