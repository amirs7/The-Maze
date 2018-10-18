const express = require('express');
const app = express();

const User = require('../../data_access/models/user');
const Maze = require('../../data_access/models/maze');
const Profile = require('../../data_access/models/profile');

app.get('/', async(req, res) => {
  const users = await User.find({});
  res.render('admin/user/list', { users });
});

app.get('/new', async(req, res) => {
  res.render('admin/user/new');
});

app.post('/', async(req, res) => {
  let user = new User({ _id: req.body.username, name: req.body.name, password: req.body.password });
  await user.save();
  res.redirect('/admin/user');
});

app.get('/:username', async(req, res) => {
  const user = await User.findById(req.params.username);
  const profile = await Profile.findOne({ user });
  res.render('admin/user/show', { user, profile });
});

app.delete('/:username', async(req, res) => {
  const user = await User.findById(req.params.username);
  await user.remove();
  res.redirect('/admin/user/');
});

app.post('/:username/profile', async(req, res) => {
  const user = await User.findById(req.params.username);
  const maze = await Maze.getInstance();
  if (await Profile.findOne({ user }))
    return res.sendStatus(400);
  const profile = new Profile({ maze, user });
  await profile.save();
  res.redirect(`/admin/user/${user.username}`);
});

app.delete('/:username/profile', async(req, res) => {
  const user = await User.findById(req.params.username);
  const maze = await Maze.getInstance();
  let profile = await Profile.findOne({ user });
  if (!profile)
    return res.sendStatus(404);
  await profile.remove();
  res.redirect(`/admin/user/${user.username}`);
});

app.param('/:username', async(req, res, next, id) => {
  req.user = await User.findById(id);
  next();
});

module.exports = app;
