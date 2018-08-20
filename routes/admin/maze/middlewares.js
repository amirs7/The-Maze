const Maze = require('../../../data_access/models/maze');
const MazePuzzle = require('../../../data_access/models/mazePuzzle');
const Puzzle = require('../../../data_access/models/puzzle');

async function findMaze(req, res, next) {
  req.maze = await Maze.getInstance();
  next();
}

async function findMazePuzzle(req, res, next, id) {
  req.mazePuzzle = await MazePuzzle.findById(id).populate({
    path: 'prerequisites',
    populate: { path: 'puzzle' }
  }).populate('puzzle');
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
  res.render('admin/maze/puzzles/show', { mazePuzzle, mazePuzzles });
}

async function addPrerequisite(req, res) {
  const mazePuzzle = req.mazePuzzle;
  const prerequisite = await MazePuzzle.findById(req.body.mazePuzzleId);
  if (prerequisite)
    mazePuzzle.prerequisites.addToSet(prerequisite);
  await mazePuzzle.save();
  res.redirect(`/admin/maze/puzzles/${mazePuzzle.id}`);
}

async function removePrerequisite(req, res) {
  const mazePuzzle = req.mazePuzzle;
  mazePuzzle.prerequisites.remove(req.params.prerequisiteId);
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
  findMaze, findMazePuzzle, index, addPuzzle, showPuzzle, removePuzzle, addPrerequisite, removePrerequisite
};
