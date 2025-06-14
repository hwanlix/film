import List from "../models/List.js";

export async function ensureDefaultLists(userId) {
  const defaultNames = ['Favourites', 'Watched', 'Watchlist'];

  for (const name of defaultNames) {
    const exists = await List.findByName(name, userId);
    if (!exists) {
      console.log(`Creating default list "${name}" for user ${userId}`);
      await List.add(new List(name, userId));
    }
  }
  console.log('Finished ensuring default lists');
} 


export async function getJSONlists(req, res) {
  const userId = req.user.userId;
  const savedLists = await List.getAll(userId);
  res.json(savedLists);
}


export async function getListsView(req, res) {
  
  const userId = req.user.userId;
  await ensureDefaultLists(userId);
  const savedLists = await List.getAll(userId);

    res.render("listsPage.ejs", {
      savedLists,
    });
}

export async function createNewList(req, res) {
  const userId = req.user.userId;
  const rawName = req.body.name;
  const name = rawName?.trim();

  if (!name) {
    return res.status(400).send('List name is required');
  }
  
  const existing = await List.findByName(name, userId);
  if (existing) {
    return res.status(409).render("409.ejs");
  }

  const newList = new List(name, userId);
  await List.add(newList);

  res.status(302).redirect("/api/lists/view");

}


export async function getListView(request, response) {
  const userId = request.user.userId;
  const name = request.params.name;
  const list = await List.findByName(name, userId);
  if (!list) return response.status(404).render("404.ejs");

  const savedLists = await List.getAll(userId);

  const savedMovies = await List.getMovies(name, userId) || [];

  const favouritesList = await List.findByName("Favourites", userId);
  const watchedList = await List.findByName("watched", userId);
  const watchList = await List.findByName("Watchlist", userId);

  response.render("list.ejs", {
    list,
    favouritesList,
    watchedList,
    watchList,
    savedLists,
    savedMovies,
  });
}


export async function deleteList(req, res) {
  const userId = req.user.userId;
  const name = req.params.name;
  await List.deleteByName(name, userId);

  res.status(200).redirect("/api/lists/view");

}


export async function addMovieToUserList(req, res) {
  const userId = req.user.userId;
  const { id, title, posterURL, genres, rating } = req.body;
  const { name: listName } = await req.params;

  if (!listName?.trim() || !id?.trim() || !title?.trim())
    return res.status(404).render("404.ejs");

  const list = await List.findByName(listName, userId);
  
  if (!list) {
    return res.status(404).render("404.ejs");
  }
    const movies = list.movies || [];
    const alreadyExists = movies.some(m => m.id === id);
    if (alreadyExists) {
        return res.status(409).render('409.ejs');
    }

    await List.addMovieToList(listName, userId, { id, title, posterURL, genres, rating });

    res.status(200).redirect(`/api/lists/${encodeURIComponent(listName)}`);

  
}


export async function getMoviesFromUserList(req, res) {
  const userId = req.user.userId;
  const { name: listName } = await req.params;

  const list = await List.findByName(listName, userId);

  if (!list) {
    return res.status(404).render("404.ejs");
  }

  res.status(200).json(list.getMovies());

}



export async function deleteMovieFromUserList(req, res) {
    const userId = req.user.userId;
    const { name: listName, id: movieId } = req.params;

    const list = await List.findByName(listName, userId);

    if (!list) {
        return res.status(404).render("404.ejs");
    }
    const movies = list.movies || [];
    const exists = movies.some(m => m.id === movieId);
    if (!exists) {
        return res.status(404).render('404.ejs');
    }

    await List.deleteMovieFromList(listName, userId, movieId);

    res.status(200).redirect(`/api/lists/${encodeURIComponent(listName)}`);


}
