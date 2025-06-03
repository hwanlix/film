import { Router } from 'express';
const router = Router();
import { getMoviesView, getPopularMovies, searchMovies } from '../controllers/movieController.js';

router.get('/', getMoviesView);
//router.get('/popular', getPopularMovies);
//router.get('/search', searchMovies);

export default router;
