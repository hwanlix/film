import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import db from "./database.js";
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

dotenv.config();

const { mongoConnect } = db;

const app = express();

const PORT = process.env.PORT || 5000;

const swaggerDocument = YAML.load('./MovieApp/swagger.yaml');

app.use(express.json());
app.use(express.static(path.join(process.cwd(), '/MovieApp/public')));
app.use(express.urlencoded({ extended: true }))
app.use(cors());
app.use(cookieParser());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

mongoConnect(async () => {

  const movieRoutes = (await import('./routes/movieRoutes.js')).default;
  const listRoutes = (await import('./routes/listRoutes.js')).default;
  const authRoutes = (await import('./routes/authRoutes.js')).default;

  app.use('/api/auth', authRoutes);
  app.use('/api/movies', movieRoutes);
  app.use('/api/lists', listRoutes);

  app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found' });
  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  
});
