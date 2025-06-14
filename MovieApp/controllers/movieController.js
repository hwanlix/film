import fetch from 'node-fetch';

const OMDB_API_KEY = '9308f81f';
const TMDB_API_KEY = '933abbf58300a7122fefbf46dc1ea4f4';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';


const genreMap = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western'
};


async function fetchPopularMovies() {
  const response = await fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`);
  if (!response.ok) throw new Error(`TMDb API error: ${response.statusText}`);
  
  const data = await response.json();
  if (!data.results) throw new Error('TMDb response missing results');

  return data.results.map(movie => ({
    id: movie.id,
    title: movie.title,
    posterUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
    genres: Array.isArray(movie.genre_ids) ? movie.genre_ids.map(id => genreMap[id]).filter(Boolean) : [],
    rating: movie.vote_average ?? null,
  }));
}


async function fetchMovieDetailsFromTMDb(tmdbId) {
  const response = await fetch(`${TMDB_BASE_URL}/movie/${tmdbId}?api_key=${TMDB_API_KEY}&language=en-US`);
  if (!response.ok) throw new Error(`TMDb API error: ${response.statusText}`);
  const data = await response.json();
  return data;
}


async function fetchMovieDetailsFromOMDb(imdbId) {
  const response = await fetch(`http://www.omdbapi.com/?i=${imdbId}&apikey=${OMDB_API_KEY}`);
  if (!response.ok) throw new Error(`OMDb API error: ${response.statusText}`);
  const data = await response.json();
  if (data.Response === "False") throw new Error(`OMDb API error: ${data.Error}`);
  return data;
}

export async function getMergedMovieDetails(req, res) {
  try {
    const { tmdbId } = req.params;

    // Step 1: Get TMDb details (to get imdb_id)
    const tmdbDetails = await fetchMovieDetailsFromTMDb(tmdbId);
    const imdbId = tmdbDetails.imdb_id;

    if (!imdbId) {
      return res.status(404).json({ error: 'IMDb ID not found for this movie' });
    }

    // Step 2: Get OMDb details by imdbId
    const omdbDetails = await fetchMovieDetailsFromOMDb(imdbId);

    // Step 3: Merge data (example: combine TMDb info with OMDb Ratings and Plot)
    const mergedDetails = {
      id: tmdbDetails.id,
      title: tmdbDetails.title,
      posterUrl: tmdbDetails.poster_path ? `https://image.tmdb.org/t/p/w500${tmdbDetails.poster_path}` : null,
      genres: tmdbDetails.genres || [],
      rating: tmdbDetails.vote_average ?? null,
      overview: tmdbDetails.overview,
      releaseDate: tmdbDetails.release_date,

      // Added from OMDb:
      plot: omdbDetails.Plot,
      ratings: omdbDetails.Ratings, // e.g., Rotten Tomatoes, Metacritic ratings
      awards: omdbDetails.Awards,
      runtime: omdbDetails.Runtime,
      director: omdbDetails.Director,
      actors: omdbDetails.Actors,
      language: omdbDetails.Language,
      country: omdbDetails.Country,
      boxOffice: omdbDetails.BoxOffice,
    };

    res.json(mergedDetails);
  } catch (error) {
    console.error('Error in getMergedMovieDetails:', error.message);
    res.status(500).json({ error: error.message });
  }
}

export async function getPopularMovies(req, res) {
    try {
        const response = await fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`);
        
        if (!response.ok) {
        return res.status(response.status).json({ error: `TMDb API error: ${response.statusText}` });
        }

        const data = await response.json();

        if (!data.results) {
        return res.status(500).json({ error: 'TMDb response missing results' });
        }

        const films = data.results.map(movie => ({
        id: movie.id,
        title: movie.title,
        posterUrl: movie.poster_path 
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
            : null,
        genres: Array.isArray(movie.genre_ids) 
            ? movie.genre_ids.map(id => genreMap[id]).filter(Boolean) 
            : [],
        rating: movie.vote_average?.toFixed(1) ?? null,
        }))

        res.json({ movies: films });

    } catch (error) {
        console.error('Error in getPopularMovies:', error);
        res.status(500).json({ error: 'Failed to fetch popular movies' });
    }
}

/*export async function getMoviesView(req, res) {
    try {
        const popularMovies = await fetchPopularMovies();

        res.render('home-page', { movies: popularMovies });
    } catch (error) {
        console.error(error);
        res.render('home-page', { movies: [] });
    }
} */

export async function searchMovies(req, res) {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Missing query parameter' });
    }

    const response = await fetch(`${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=en-US&query=${query}`);

    if (!response.ok) {
      return res.status(response.status).json({ error: `TMDb API error: ${response.statusText}` });
    }

    const data = await response.json();

    if (!data.results) {
      return res.status(500).json({ error: 'TMDb response missing results' });
    }

    res.json({
      films: data.results.map(movie => ({
        id: movie.id,
        title: movie.title,
        posterUrlPreview: movie.poster_path 
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
          : null,
        genres: Array.isArray(movie.genre_ids) 
          ? movie.genre_ids.map(id => genreMap[id]).filter(Boolean)
          : [],
        rating: movie.vote_average?.toFixed(1) ?? null,
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
}
