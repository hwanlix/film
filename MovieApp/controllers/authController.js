import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { ensureDefaultLists } from '../controllers/listController.js';

const JWT_SECRET = process.env.JWT_SECRET || '5fe9034a9540e743188ac16ec2000b7a868fb8cb772701082ba39437676db4e5';

export async function showLoginForm(req, res) {
  res.render('loginPage', { error: null, success: null });
}

export async function showRegisterForm(req, res) {
  res.render('registerPage', { error: null, success: null });
}

export async function register(req, res) {
  const { username, password } = req.body;
  try {
    const existing = await User.findByUsername(username);
    if (existing) return res.status(400).render('registerPage', { error: 'User already exists', success: null });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, password: hashedPassword });

    console.log(newUser);
    console.log(newUser._id);
    await ensureDefaultLists(newUser._id);

    res.render('loginPage', { error: null, success: 'User registered successfully. Please log in.' });
  } catch (err) {
    console.error('❌ Registration error:', err);
    res.status(500).render('registerPage', { error: 'Server error', success: null });
  }
}

export async function login(req, res) {
  const { username, password } = req.body;
  try {
    const user = await User.findByUsername(username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, {
      httpOnly: true,    // JS cannot access this cookie (security)
      secure: process.env.NODE_ENV === 'production', // only on HTTPS in prod
      sameSite: 'strict', 
      maxAge: 24 * 60 * 60 * 1000 // 1 day expiration
    });
    res.json({ message: 'Logged in successfully' });


  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

export function logout(req, res) {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });
  res.json({ message: 'Logged out successfully' });
}
