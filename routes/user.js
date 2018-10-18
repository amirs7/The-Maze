const express = require('express');

const logger = require('../common').logger;
const passport = require('../common/passport');
const jwt = require('jsonwebtoken');
const mailer = require('../common/mailer');
const config = require('../config');

const app = express();

const User = require('../data_access/models/user');

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.get('/login', (req, res, next) => {
  return res.render('user/login');
});

app.post('/login',
  passport.authenticate('local', { failureRedirect: '/user/login' }),
  async(req, res) => {
    let user = req.user;
    user.ip = req.ip;
    await user.save();
    res.cookie('username', user.username);
    res.redirect('/maze');
  });

app.get('/signup', (req, res, next) => {
  res.render('user/signup');
});

app.post('/signup', async(req, res, next) => {
  let userData = {};
  userData.username = req.body.email;
  userData.password = req.body.password;
  userData.name = req.body.name;
  userData.studyField = req.body.studyField;
  let user = await User.findOne({ _id: userData.username });
  if (user)
    return res.sendStatus(409);
  let token = jwt.sign(userData, config.jwtSecret);
  mailer.sendVerificationEmail(`${config.hostname}/user/verify/${token}`, userData.username);
  res.render('user/signup');
});

app.get('/verify/:token', async function(req, res, next) {
  let userData = jwt.verify(req.params.token, config.jwtSecret);
  let user = await User.findOne({ _id: userData.username });
  if (user)
    return res.sendStatus(409);
  user = new User(userData);
  await user.save();
  res.redirect('/user/login');
});

app.get('/profile', passport.isAuthenticated, (req, res) => {
  console.log(req.user);
  return res.render('user/profile', { user: req.user });
});

module.exports = app;
