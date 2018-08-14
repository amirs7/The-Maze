const express = require('express');

const puzzleRoutes = require('./puzzle');
const logger = require('../../common').logger;
const passport = require('../../common/passport');

const app = express();

app.use('/puzzle', puzzleRoutes);
app.get('/', passport.isAuthenticated, passport.isAdmin, (req, res) => {
  return res.render('admin/home');
});

module.exports = app;
