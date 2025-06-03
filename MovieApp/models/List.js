import db from '../database.js';
const { getDatabase } = db;

const COLLECTION_NAME = 'movies_lists';

class List {
  constructor(name) {
    this.name = name;
    this.movies = [];
  }


  static async getAll() {
    const db = getDatabase();
    try {
      return await db.collection(COLLECTION_NAME).find({}).toArray();
    } catch (error) {
      console.error('Error while fetching all lists:', error);
      return [];
    }
  }

  static async findByName(name) {
    const db = getDatabase();
    try {
      return await db.collection(COLLECTION_NAME).findOne({ name });
    } catch (error) {
      console.error('Error while finding list by name:', error);
      return null;
    }
  }

  static async add(list) {
    const db = getDatabase();
    try {
      if (!list || !list.name) {
        throw new Error('Invalid list object passed to add()');
      }
      const exists = await this.findByName(list.name);
      if (!exists) {
        await db.collection(COLLECTION_NAME).insertOne(list);
      }
    } catch (error) {
      console.error('Error while adding list:', error);
    }
  }

  static async deleteByName(name) {
    const db = getDatabase();
    try {
      await db.collection(COLLECTION_NAME).deleteOne({ name });
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


  static async addMovieToList(listName, movie) {
    const db = getDatabase();
    try {
      // Only add if not already in the list
      await db.collection(COLLECTION_NAME).updateOne(
        { name: listName, 'movies.id': { $ne: movie.id } },
        { $push: { movies: movie } }
      );
    } catch (error) {
      console.error('Error while adding movie:', error);
    }
  }

  static async deleteMovieFromList(listName, movieId) {
    const db = getDatabase();
    try {
      await db.collection(COLLECTION_NAME).updateOne(
        { name: listName },
        { $pull: { movies: { id: movieId } } }
      );
    } catch (error) {
      console.error('Error while removing movie:', error);
    }
  }

  static async getMovies(listName) {
    const db = getDatabase();
    try {
      const list = await db.collection(COLLECTION_NAME).findOne({ name: listName });
      return list?.movies || [];
    } catch (error) {
      console.error('Error while getting movies:', error);
      return [];
    }
  }
}

export default List;
