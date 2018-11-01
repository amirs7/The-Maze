const express = require('express');

const maze = require('./middlewares');
const hint = require('./hint');
const logger = require('../../../common/index').logger;

const app = express();

app.use(maze.findMaze);

app.param('mazePuzzleId', maze.findMazePuzzle);

app.use('/hint', hint);

app.get('/', maze.index);

app.post('/puzzles', maze.addPuzzle);

app.get('/puzzles/:mazePuzzleId', maze.showPuzzle);

app.post('/puzzles/:mazePuzzleId/prerequisites', maze.addPrerequisite);

app.post('/puzzles/:mazePuzzleId/feedbacks', maze.addFeedback);

app.delete('/puzzles/:mazePuzzleId/prerequisites/:prerequisiteId', maze.removePrerequisite);

app.delete('/puzzles/:mazePuzzleId/feedbacks/:feedbackId', maze.removeFeedback);

app.delete('/puzzles/:mazePuzzleId', maze.removePuzzle);

module.exports = app;
