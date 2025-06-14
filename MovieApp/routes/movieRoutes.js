import { Router } from 'express';
const router = Router();
import { getMoviesView, getPopularMovies, searchMovies, getMergedMovieDetails } from '../controllers/movieController.js';

router.get('/', getMoviesView);
router.get('/popular', getPopularMovies);
router.get('/search', searchMovies);
router.get('/:tmdbId/details', getMergedMovieDetails);

export default router;
