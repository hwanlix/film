const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./database.js');
const path = require('path');

dotenv.config();

const { mongoConnect } = db;

const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoConnect(async () => {
  const { ensureDefaultLists } = require('./controllers/listController.js');
  await ensureDefaultLists();

  const movieRoutes = require('./routes/movieRoutes.js');
  const listRoutes = require('./routes/listRoutes.js');

  app.use('/api/movies', movieRoutes);
  app.use('/api/lists', listRoutes);

  app.get('/add', (req, res) => {
    res.render('add');
  });

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
