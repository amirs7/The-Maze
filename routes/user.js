const express = require('express');

const logger = require('../common').logger;
const passport = require('../common/passport');
const jwt = require('jsonwebtoken');
const mailer = require('../common/mailer');
const config = require('../config');
const validator = require('../common/validator');

const app = express();

const User = require('../data_access/models/user');

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.get('/login', (req, res, next) => {
  return res.render('user/login', { status: null, message: null });
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
  res.render('user/signup', { status: null, message: null, data: {} });
});

app.post('/signup', async(req, res, next) => {
  let userData = {};
  userData.username = req.body.email;
  userData.password = req.body.password;
  userData.name = req.body.name;
  userData.studyField = req.body.studyField;
  if (!req.body.email || !req.body.name || !req.body.password || !req.body.repeatPassword)
    return res.render('user/signup', { status: 'error', message: 'لطفا تمامی موارد را پر کنید.', data: userData });
  let result = { status: 'success', message: null };
  if (!validator.isEnglish(userData.name))
    return res.render('user/signup', {
      status: 'error',
      message: 'لطفا نام خود را به انگلیسی وارد کنید.',
      data: userData
    });
  if (!validator.validateEmail(userData.username))
    return res.render('user/signup', { status: 'error', message: 'ایمیل را به درستی وارد کنید.', data: userData });
  else if (userData.password !== req.body.repeatPassword)
    return res.render('user/signup', { status: 'error', message: 'گذرواژه و تکرار آن یکسان نیستند.', data: userData });
  let user = await User.findOne({ _id: userData.username });
  if (user)
    return res.render('user/signup', { status: 'error', message: 'این ایمیل قبلا ثبت شده است.', data: userData });
  let token = jwt.sign(userData, config.jwtSecret);
  // mailer.sendVerificationEmail(`${config.hostname}/user/verify/${token}`, userData.username);
  // res.render('user/signup', {
  //   status: 'success',
  //   message: 'اطلاعات شما ثبت شد. برای تکمیل ثبت نام از لینکی که برای شما ایمیل شده است استفاده کنید.',
  //   data: {}
  // });
  user = new User(userData);
  await user.save();
  return res.render('user/login', { status: 'success', message: 'ثبت‌ نام شما با موفقیت انجام شد.' });
});

app.get('/verify/:token', async function(req, res, next) {
  return res.sendStatus(404);
  let userData = jwt.verify(req.params.token, config.jwtSecret);
  let user = await User.findOne({ _id: userData.username });
  if (user)
    return res.render('user/login', { status: 'error', message: 'این لینک قبلا استفاده شده است.'});
  user = new User(userData);
  await user.save();
  return res.render('user/login', { status: 'success', message: 'ثبت‌ نام شما با موفقیت انجام شد.'});
});

app.get('/profile', passport.isAuthenticated, (req, res) => {
  return res.render('user/profile', { user: req.user });
});


module.exports = app;
