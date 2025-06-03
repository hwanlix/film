import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import movieRoutes from './routes/movieRoutes.js';
import db from "./database.js";
import path from 'path';
import { fileURLToPath } from 'url';

const { mongoConnect, getDatabase } = db;

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const PORT = process.env.PORT || 5000;

app.use(cors());
//app.use(express.static(path.join(__dirname, '../public')));
app.use('/api/movies', movieRoutes);

//app.get('/api/movies', (req, res) => {
//  res.sendFile(path.join(__dirname, 'public', 'index.html'));
//});

mongoConnect(() => {
  app.listen(PORT);
});
