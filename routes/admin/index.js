const express = require('express');

const puzzleRoutes = require('./puzzle');
const mazeRoutes = require('./maze');
const userRoutes = require('./user');
const hintRoutes = require('./maze/hint');
const logger = require('../../common').logger;
const passport = require('../../common/passport');

const app = express();

app.use(passport.isAdmin);

app.use('/puzzle', puzzleRoutes);
app.use('/maze', mazeRoutes);
app.use('/user', userRoutes);

app.get('/', (req, res) => {
  return res.render('admin/home');
});

module.exports = app;
