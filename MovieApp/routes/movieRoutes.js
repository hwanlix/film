import { Router } from 'express';
const router = Router();
import { getPopularMovies, searchMovies, getMergedMovieDetails } from '../controllers/movieController.js';

//router.get('/', getMoviesView);
router.get('/', getPopularMovies);
router.get('/search', searchMovies);
router.get('/:tmdbId/details', getMergedMovieDetails);

export default router;
