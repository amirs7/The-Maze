const express = require('express');

const maze = require('./middlewares');
const hint = require('./hint');
const clue = require('./clue');
const logger = require('../../../common/index').logger;

const app = express();

app.use(maze.findMaze);

app.param('mazePuzzleId', maze.findMazePuzzle);

app.use('/hint', hint);

app.use('/clue', clue);

app.get('/', maze.index);

app.post('/puzzles', maze.addPuzzle);

app.get('/puzzles/:mazePuzzleId', maze.showPuzzle);

app.post('/puzzles/:mazePuzzleId/prerequisites', maze.addPrerequisite);

app.delete('/puzzles/:mazePuzzleId/prerequisites/:prerequisiteId', maze.removePrerequisite);

app.post('/puzzles/:mazePuzzleId/clues', maze.addClue);

app.delete('/puzzles/:mazePuzzleId/clues/:clueId', maze.removeClue);

app.post('/puzzles/:mazePuzzleId/nextPuzzle', maze.setNextPuzzle);

app.delete('/puzzles/:mazePuzzleId', maze.removePuzzle);

module.exports = app;
