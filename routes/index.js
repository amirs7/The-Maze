const express = require('express');

const userRoutes = require('./user');
const adminRoutes = require('./admin');
const mazeRoutes = require('./maze');
const logger = require('../common').logger;

const app = express();
app.set('view engine', 'ejs');

app.use('/user', userRoutes);
app.use('/maze', mazeRoutes);
app.use('/admin', adminRoutes);

app.get('/home', (req, res, next) => {
  res.render('index', { title: 'Hello World!, This is the maze' });
  return next();
});

app.get('/guard', (req, res, next) => {
  res.render('common/guard');
  return next();
});

app.use((err, req, res, next) => {
  logger.error(err);
});

//router.use((req, res, next) => {
//  res.sendStatus(404);
//});

module.exports = app;
