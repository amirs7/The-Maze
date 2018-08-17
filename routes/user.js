const express = require('express');

const logger = require('../common').logger;
const passport = require('../common/passport');

const app = express();

const User = require('../data_access/models/user');

app.get('/signup', (req, res, next) => {
  return res.render('user/signup');
});

app.post('/signup', async(req, res, next) => {
  try {
    const { name, username, password } = req.body;
    let user = new User({ name, username, password });
    await user.save();
    res.sendStatus(200);
  } catch (error) {
    logger.error(error);
    res.sendStatus(400);
  }
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.get('/login', (req, res, next) => {
  return res.render('user/login');
});

app.post('/login',
  passport.authenticate('local', { failureRedirect: '/user/login' }),
  async (req, res) => {
    let user = req.user;
    user.ip = req.ip;
    await user.save();
    res.cookie('username', user.username);
    res.redirect('/user/profile');
  });

app.get('/profile', passport.isAuthenticated, (req, res) => {
  return res.render('user/profile', { user: req.user });
});

module.exports = app;
