import express from 'express';
import userRoutes from './routes/user.js';
import placeRoutes from './routes/places.js';
import HttpError from './models/httpError.js';
import bodyParser from 'body-parser';
import { uri } from './util/connect.js';
import mongoose from 'mongoose';

const app = express();
app.use(bodyParser.json());

app.use('/api/user', userRoutes);
app.use('/api/places', placeRoutes);

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    console.log('bababoowie');
    return next(error);
  }

  res
    .status(error.code || 500)
    .json({ message: error.message || 'An unknown error occcured' });
});

mongoose
  .connect(uri)
  .then(() => {
    app.listen(4000);
    console.log(
      'Connected to database, and server is now running on port 4000'
    );
  })
  .catch(() => {
    console.log('Failed to connect to database');
  });
