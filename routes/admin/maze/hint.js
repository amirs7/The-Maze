const express = require('express');

const app = express();
const Hint = require('../../../data_access/models/hint');
const utils = require('../../../common/index').utils;

app.get('/', async(req, res) => {
  let hints;
  if (req.query.status)
    hints = await Hint.find({ status: req.query.status });
  else
    hints = await Hint.find({});
  console.log(hints);
  res.render('admin/hint/index', { hints });
});

app.post('/generate', async(req, res) => {
  let hint = new Hint({ code: utils.randomString(6) });
  await hint.save();
  res.redirect('/admin/maze/hint');
});

app.param('hintId', async(req, res, next, id) => {
  req.hint = await Hint.findById(id).populate({ path: 'mazePuzzle', populate: { path: 'puzzle' } });
  next();
});

app.get('/:hintId', async(req, res) => {
  res.render('admin/hint/show', { hint: req.hint });
});

app.post('/:hintId', async(req, res) => {
  const answer = req.body.answer;
  if (!answer)
    return res.sendStatus(400);
  let hint = req.hint;
  hint.answer = answer;
  hint.status = 'answered';
  await hint.save();
  res.redirect(`/admin/maze/hint/${req.params.hintId}`);
});

app.put('/:hintId', async(req, res) => {
  const answer = req.body.answer;
  if (!answer)
    return res.sendStatus(400);
  let hint = req.hint;
  hint.answer = answer;
  await hint.save();
  res.redirect(`/admin/maze/hint/${req.params.hintId}`);
});

module.exports = app;
