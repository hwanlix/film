import fetch from 'node-fetch';

const TMDB_API_KEY = '933abbf58300a7122fefbf46dc1ea4f4';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

async function fetchPopularMovies() {
  const response = await fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`);
  if (!response.ok) throw new Error(`TMDb API error: ${response.statusText}`);
  
  const data = await response.json();
  if (!data.results) throw new Error('TMDb response missing results');

  return data.results.map(movie => ({
    id: movie.id,
    title: movie.title,
    posterUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
    genres: Array.isArray(movie.genre_ids) ? movie.genre_ids.map(id => ({ genre: id })) : [],
    rating: movie.vote_average ?? null,
  }));
}


//to delete
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
            ? movie.genre_ids.map(id => ({ genre: id })) 
            : [],
        rating: movie.vote_average ?? null,
        }))

        res.json({ movies: films });

    } catch (error) {
        console.error('Error in getPopularMovies:', error);
        res.status(500).json({ error: 'Failed to fetch popular movies' });
    }
}

export async function getMoviesView(req, res) {
    try {
        const popularMovies = await fetchPopularMovies();

        res.render('home-page', { movies: popularMovies });
    } catch (error) {
        console.error(error);
        res.render('home-page', { movies: [] });
    }
}

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
          ? movie.genre_ids.map(id => ({ genre: id })) 
          : [],
        rating: movie.vote_average ?? null,
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
}
