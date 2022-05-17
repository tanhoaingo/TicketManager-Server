const env = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const path = require('path');
const AppError = require('./pages/AppError');

const admin_authRoutes = require('./routes/admin/auth');

const enterpriseRoutes = require('./routes/enterprise');

const app = express();

env.config();

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@ticketmanager-v2.uwkjp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log('Database connected');
  });

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cors());

app.use(express.static(path.join(__dirname, './uploads')));

app.get('/', (req, res, next) => {
  const error = new AppError(`Error on this server`, 404);

  return next(error);
});

app.use('/api/admin', admin_authRoutes);

app.use('/api/enterprise', enterpriseRoutes);

app.all('*', (req, res, next) => {
  const error = new AppError(`Can't find ${req.originalUrl} on this server`, 404);

  next(error);
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
