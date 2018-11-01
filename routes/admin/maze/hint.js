const express = require('express');

const app = express();
const HintCode = require('../../../data_access/models/hintCode');
const utils = require('../../../common/index').utils;

app.get('/', async(req, res) => {
  let hints;
  if (req.query.status)
    hints = await HintCode.find({ status: req.query.status });
  else
    hints = await HintCode.find({});
  res.render('admin/hint/index', { hints });
});
//
app.post('/generate', async(req, res) => {
  let hint = new HintCode({ code: utils.randomString(6) });
  await hint.save();
  res.redirect('/admin/maze/hint');
});
//
app.param('hintId', async(req, res, next, id) => {
  req.hint = await HintCode.findById(id);
  next();
});

app.get('/:hintId', async(req, res) => {
  res.render('admin/hint/show', { hint: req.hint });
});
//
//app.post('/:hintId', async(req, res) => {
//  const answer = req.body.answer;
//  if (!answer)
//    return res.sendStatus(400);
//  let hint = req.hint;
//  hint.answer = answer;
//  hint.status = 'answered';
//  await hint.save();
//  res.redirect(`/admin/maze/hint/${req.params.hintId}`);
//});
//
//app.put('/:hintId', async(req, res) => {
//  const answer = req.body.answer;
//  if (!answer)
//    return res.sendStatus(400);
//  let hint = req.hint;
//  hint.answer = answer;
//  await hint.save();
//  res.redirect(`/admin/maze/hint/${req.params.hintId}`);
//});

module.exports = app;
