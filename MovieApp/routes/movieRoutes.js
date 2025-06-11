import { Router } from 'express';
const router = Router();
import {
  getMoviesView,
  getPopularMovies,
  searchMovies,
  addNewMovie,
} from '../controllers/movieController.js';

router.get('/', getMoviesView);
router.get('/popular', getPopularMovies);
router.get('/search', searchMovies);
router.post('/movies', addNewMovie);

export default router;
