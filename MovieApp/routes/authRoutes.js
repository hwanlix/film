import express from 'express';
import { login, register, showLoginForm, showRegisterForm, logout } from '../controllers/authController.js';

const router = express.Router();

router.get('/login', showLoginForm);
router.get('/register', showRegisterForm);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

export default router;
