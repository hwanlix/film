import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
//import movieRoutes from './routes/movieRoutes.js';
//import listRoutes from './routes/listRoutes.js';
import db from "./database.js";
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const { mongoConnect } = db;

const app = express();

const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors());
app.use(cookieParser());

mongoConnect(async () => {

  const movieRoutes = (await import('./routes/movieRoutes.js')).default;
  const listRoutes = (await import('./routes/listRoutes.js')).default;
  const authRoutes = (await import('./routes/authRoutes.js')).default;

  app.get('/test', (req, res) => {
    res.json({ message: 'Hello World' });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/movies', movieRoutes);
  app.use('/api/lists', listRoutes);

  app.listen(PORT, () => {
    console.log('Server is running');
  });

  
});
