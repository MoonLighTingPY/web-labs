import express, { json } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dataRoutes from './src/routes/dataRoutes.js';
import dotenv from 'dotenv';
import process from 'process';

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(json());

// Use the data routes
app.use(dataRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});