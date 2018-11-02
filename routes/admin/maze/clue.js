const express = require('express');

const Clue = require('../../../data_access/models/clue');
const logger = require('../../../common').logger;

const app = express();

app.get('/', async(req, res) => {
  try {
    const clues = await Clue.find();
    return res.render('admin/clue/list', { clues });
  } catch (error) {
    logger.error(error);
    return res.sendStatus(500);
  }
});

app.get('/new', (req, res) => {
  return res.render('admin/clue/new');
});

app.post('/', async(req, res) => {
  try {
    let clue = new Clue(req.body);
    await clue.save();
    return res.redirect(`clue/${clue.id}`);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

app.param('clueId', async(req, res, next, id) => {
  try {
    req.clue = await Clue.findById(id);
    next();
  } catch (error) {
    logger.error(error);
    return res.sendStatus(500);
  }
});

app.get('/:clueId', (req, res) => {
  const clue = req.clue;
  if (!clue) return res.sendStatus(404);
  return res.render('admin/clue/show', { clue });
});

app.put('/:clueId', async(req, res) => {
  try {
    let clue = req.clue;
    clue.set(req.body);
    await clue.save();
    return res.redirect(clue.id);
  } catch (error) {
    logger.error(error);
    res.sendStatus(400);
  }
});

app.delete('/:clueId', async(req, res) => {
  try {
    await req.clue.remove();
    return res.redirect('/admin/maze/clue');
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
});

module.exports = app;
