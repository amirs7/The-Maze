const express = require('express');

const userRoutes = require('./user');
const adminRoutes = require('./admin');
const logger = require('../common').logger;

const app = express();
app.set('view engine', 'ejs');

app.use('/user', userRoutes);
app.use('/admin', adminRoutes);

app.get('/home', (req, res, next) => {
  res.render('index', { title: 'Hello World!, This is the maze' });
  return next();
});

app.use((err, req, res, next) => {
  logger.error(err);
});

//router.use((req, res, next) => {
//  res.sendStatus(404);
//});

module.exports = app;
