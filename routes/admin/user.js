const express = require('express');
const app = express();

const User = require('../../data_access/models/user');

app.get('/', async (req, res) => {
  const users = await User.find({});
  res.render('admin/user/list', { users });
});

app.get('/:username', (req, res) => {
  const user = req.user;
  res.render('admin/user/show', { user });
});

app.param('/:username', async (req, res, next, id) => {
  req.user = await User.findById(id);
  next();
});

module.exports = app;
