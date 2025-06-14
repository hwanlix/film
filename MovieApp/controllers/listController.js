import List from "../models/List.js";

export async function ensureDefaultLists(userId) {
  const defaultNames = ['Favourites', 'Watched', 'Watchlist'];

  for (const name of defaultNames) {
    const exists = await List.findByName(name, userId);
    if (!exists) {
      await List.add(new List(name, userId));
    }
  }
}


export async function getListsView(req, res) {
  
  try {
    const userId = req.user.userId;
    await ensureDefaultLists(userId);
    const savedLists = await List.getAll(userId);
    res.status(200).json({ savedLists });
  } catch (err) {
    console.error('Error fetching lists:', err);
    res.status(500).json({ error: 'Failed to retrieve lists' });
  }

}

export async function createNewList(req, res) {
  const userId = req.user.userId;
  const rawName = req.body.name;
  const name = rawName?.trim();

  if (!name) {
    return res.status(400).json({ error: 'List name is required' });
  }
  
  const existing = await List.findByName(name, userId);
  if (existing) {
    return res.status(409).json({ error: 'List already exists' });
  }

  const newList = new List(name, userId);
  await List.add(newList);

  res.status(201).json({ message: 'List created successfully', list: newList });

}


export async function getListView(request, response) {
  try {
    const userId = req.user.userId;
    const name = req.params.name;
    const list = await List.findByName(name, userId);
    if (!list) return res.status(404).json({ error: 'List not found' });

    await ensureDefaultLists(userId);
    const savedLists = await List.getAll(userId);
    const savedMovies = await List.getMovies(name, userId) || [];

    res.status(200).json({ list, savedLists, savedMovies });
  } catch (err) {
    console.error('Error fetching list view:', err);
    res.status(500).json({ error: 'Failed to retrieve list view' });
  }
}


export async function deleteList(req, res) {
  try {
    const userId = req.user.userId;
    const name = req.params.name;

    await List.deleteByName(name, userId);
    res.status(200).json({ message: 'List deleted successfully' });
  } catch (err) {
    console.error('Error deleting list:', err);
    res.status(500).json({ error: 'Failed to delete list' });
  }

}


export async function addMovieToUserList(req, res) {
    try {
    const userId = req.user.userId;
    const { id, title, posterURL, genres, rating } = req.body;
    const { name: listName } = req.params;

    if (!listName?.trim() || !id?.trim() || !title?.trim())
      return res.status(400).json({ error: 'Missing required fields' });

    const list = await List.findByName(listName, userId);
    if (!list) return res.status(404).json({ error: 'List not found' });

    const movies = list.movies || [];
    const alreadyExists = movies.some(m => m.id === id);
    if (alreadyExists) {
      return res.status(409).json({ error: 'Movie already in list' });
    }

    await List.addMovieToList(listName, userId, { id, title, posterURL, genres, rating });

    res.status(200).json({ message: 'Movie added successfully' });
  } catch (err) {
    console.error('Error adding movie:', err);
    res.status(500).json({ error: 'Failed to add movie to list' });
  }
  
}


export async function getMoviesFromUserList(req, res) {
  try {
    const userId = req.user.userId;
    const { name: listName } = req.params;

    const list = await List.findByName(listName, userId);
    if (!list) return res.status(404).json({ error: 'List not found' });

    const movies = await List.getMovies(listName, userId);
    res.status(200).json({ movies });
  } catch (err) {
    console.error('Error getting movies:', err);
    res.status(500).json({ error: 'Failed to get movies from list' });
  }

}



export async function deleteMovieFromUserList(req, res) {
    try {
    const userId = req.user.userId;
    const { name: listName, id: movieId } = req.params;

    const list = await List.findByName(listName, userId);
    if (!list) return res.status(404).json({ error: 'List not found' });

    const movies = list.movies || [];
    const exists = movies.some(m => m.id === movieId);
    if (!exists) return res.status(404).json({ error: 'Movie not found in list' });

    await List.deleteMovieFromList(listName, userId, movieId);

    res.status(200).json({ message: 'Movie removed successfully' });
  } catch (err) {
    console.error('Error removing movie:', err);
    res.status(500).json({ error: 'Failed to remove movie from list' });
  }
}
