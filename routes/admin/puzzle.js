const express = require('express');

const Puzzle = require('../../data_access/models/puzzle');
const Clue = require('../../data_access/models/clue');
const logger = require('../../common').logger;

const app = express();

app.get('/', async(req, res) => {
  try {
    const puzzles = await Puzzle.find();
    return res.render('admin/puzzle/list', { puzzles });
  } catch (error) {
    logger.error(error);
    return res.sendStatus(500);
  }
});

app.get('/new', (req, res) => {
  return res.render('admin/puzzle/new');
});

app.post('/', async(req, res) => {
  try {
    let puzzle = new Puzzle(req.body);
    await puzzle.save();
    return res.redirect(`puzzle/${puzzle.id}`);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

app.param('puzzleId', async(req, res, next, id) => {
  try {
    req.puzzle = await Puzzle.findById(id);
    next();
  } catch (error) {
    logger.error(error);
    return res.sendStatus(500);
  }
});

app.get('/:puzzleId', async(req, res) => {
  const puzzle = req.puzzle;
  if (!puzzle) return res.sendStatus(404);
  return res.render('admin/puzzle/show', { puzzle });
});

app.put('/:puzzleId', async(req, res) => {
  try {
    let puzzle = req.puzzle;
    puzzle.set(req.body);
    await puzzle.save();
    return res.redirect(puzzle.id);
  } catch (error) {
    logger.error(error);
    res.sendStatus(400);
  }
});

app.delete('/:puzzleId', async(req, res) => {
  try {
    await req.puzzle.remove();
    return res.redirect('/admin/puzzle');
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
});

module.exports = app;
