import { Router } from 'express';
const router = Router();
import { getListsView, createNewList, getListView, deleteList, addMovieToUserList, deleteMovieFromUserList, getJSONlists } from '../controllers/listController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

router.use(authenticateToken);

router.get('/', getJSONlists);
router.get('/view', getListsView);
router.post("/add", createNewList);
router.get("/:name", getListView);
router.delete("/:name", deleteList);
router.post('/:name/add-movie', addMovieToUserList);
router.delete('/:name/delete-movie/:id', deleteMovieFromUserList);

export default router;
