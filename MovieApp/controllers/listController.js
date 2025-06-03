import List from "../models/List.js";

export async function ensureDefaultLists() {
  const defaultNames = ['Favourites', 'Watched', 'Watchlist'];

  for (const name of defaultNames) {
    const exists = await List.findByName(name);
    if (!exists) {
      await List.add(new List(name));
    }
  }
} 

//ensureDefaultLists();


export async function getListsView(req, res) {

  const savedLists = await List.getAll();

  const favouritesList = await List.findByName("Favourites");
  const watchedList = await List.findByName("Watched");
  const watchList = await List.findByName("Watchlist");


    res.render("listsPage.ejs", {
      favouritesList,
      watchedList,
      watchList,
      savedLists,
    });
}

export async function createNewList(req, res) {
  const rawName = req.body.name;
  const name = rawName?.trim();

  if (!name) {
    return res.status(400).send('List name is required');
  }
  
  const existing = await List.findByName(name);
  if (existing) {
    return res.status(409).render("409.ejs");
  }

  const newList = new List(name);
  await List.add(newList);

  res.status(302).redirect("/api/lists");

}


export async function getListView(request, response) {
  const name = request.params.name;
  const list = await List.findByName(name);
  const savedLists = await List.getAll();

  const savedMovies = await List.getMovies(name) || [];

  const favouritesList = await List.findByName("Favourites");
  const watchedList = await List.findByName("watched");
  const watchList = await List.findByName("Watchlist");

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
  const name = req.params.name;
  await List.deleteByName(name);

  res.status(200).redirect("/api/lists");

}


export async function addMovieToUserList(req, res) {
  const { id, title, posterURL, genres, rating } = req.body;
  const { name: listName } = await req.params;

  if (!listName?.trim() || !id?.trim() || !title?.trim())
    return res.status(404).render("404.ejs");

  const list = await List.findByName(listName);
  
  if (!list) {
    return res.status(404).render("404.ejs");
  }
    const movies = list.movies || [];
    const alreadyExists = movies.some(m => m.id === id);
    if (alreadyExists) {
        return res.status(409).render('409.ejs');
    }

    await List.addMovieToList(listName, { id, title, posterURL, genres, rating });

    res.status(200).redirect(`/api/lists/${encodeURIComponent(listName)}`);

  
}


export async function getMoviesFromUserList(req, res) {
  const { name: listName } = await req.params;

  const list = await List.List.findByName(listName);

  if (!list) {
    return res.status(404).render("404.ejs");
  }

  res.status(200).json(list.getMovies());

}



export async function deleteMovieFromUserList(req, res) {
    const { name: listName, id: movieId } = req.params;

    const list = await List.List.findByName(listName);

    if (!list) {
        return res.status(404).render("404.ejs");
    }
    const movies = list.movies || [];
    const exists = movies.some(m => m.id === movieId);
    if (!exists) {
        return res.status(404).render('404.ejs');
    }

    await List.deleteMovieFromList(listName, movieId);

    res.status(200).redirect(`/api/lists/${encodeURIComponent(listName)}`);


}
