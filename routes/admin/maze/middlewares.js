const Maze = require('../../../data_access/models/maze');
const MazePuzzle = require('../../../data_access/models/mazePuzzle');
const Puzzle = require('../../../data_access/models/puzzle');
const Clue = require('../../../data_access/models/clue');

async function findMaze(req, res, next) {
  req.maze = await Maze.getInstance();
  next();
}

async function findMazePuzzle(req, res, next, id) {
  req.mazePuzzle = await MazePuzzle.findById(id)
    .populate({
      path: 'prerequisites',
      populate: { path: 'puzzle' }
    })
    .populate({
      path: 'nextPuzzle',
      populate: { path: 'puzzle' }
    })
    .populate('puzzle').populate('clues');
  next();
}

async function index(req, res) {
  const maze = req.maze;
  const puzzles = await Puzzle.find();
  res.render('admin/maze/show', { maze, puzzles });
}

async function addPuzzle(req, res) {
  const maze = req.maze;
  const puzzle = await Puzzle.findById(req.body.puzzleId);
  await maze.addPuzzle(puzzle);
  res.redirect('/admin/maze');
}

async function showPuzzle(req, res) {
  const mazePuzzle = req.mazePuzzle;
  const mazePuzzles = req.maze.puzzles;
  let clues = {};
  if (mazePuzzle)
    clues = await Clue.find({ _id: { $nin: mazePuzzle.clues } });
  res.render('admin/maze/puzzles/show', { mazePuzzle, mazePuzzles, clues });
}

async function addPrerequisite(req, res) {
  const mazePuzzle = req.mazePuzzle;
  const prerequisite = await MazePuzzle.findById(req.body.mazePuzzleId);
  if (prerequisite)
    mazePuzzle.prerequisites.addToSet(prerequisite);
  await mazePuzzle.save();
  res.redirect(`/admin/maze/puzzles/${mazePuzzle.id}`);
}

async function addClue(req, res) {
  const mazePuzzle = req.mazePuzzle;
  let clue = await Clue.findById(req.body.clueId);
  clue.mazePuzzle = mazePuzzle;
  await clue.save();
  mazePuzzle.clues.addToSet(req.body.clueId);
  await mazePuzzle.save();
  res.redirect(`/admin/maze/puzzles/${mazePuzzle.id}`);
}

async function setNextPuzzle(req, res) {
  const mazePuzzle = req.mazePuzzle;
  const nextPuzzle = await MazePuzzle.findById(req.body.nextPuzzleId);
  if (nextPuzzle)
    mazePuzzle.nextPuzzle = nextPuzzle;
  await mazePuzzle.save();
  res.redirect(`/admin/maze/puzzles/${mazePuzzle.id}`);
}

async function removePrerequisite(req, res) {
  const mazePuzzle = req.mazePuzzle;
  mazePuzzle.prerequisites.remove(req.params.prerequisiteId);
  await mazePuzzle.save();
  res.redirect(`/admin/maze/puzzles/${mazePuzzle.id}`);
}

async function removeClue(req, res) {
  const mazePuzzle = req.mazePuzzle;
  mazePuzzle.clues.remove(req.params.clueId);
  await mazePuzzle.save();
  res.redirect(`/admin/maze/puzzles/${mazePuzzle.id}`);
}

async function removePuzzle(req, res) {
  const maze = req.maze;
  const mazePuzzle = req.mazePuzzle;
  maze.puzzles.remove(req.mazePuzzle.id);
  mazePuzzle.remove();
  await maze.save();
  res.redirect('/admin/maze');
}

module.exports = {
  findMaze,
  findMazePuzzle,
  index,
  addPuzzle,
  showPuzzle,
  removePuzzle,
  addPrerequisite,
  removePrerequisite,
  addClue,
  setNextPuzzle,
  removeClue
};
