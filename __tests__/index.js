const express = require('express');
const mongoose = require('mongoose');

const config = require('../config');

const User = require('../data_access/models/user');
const Answer = require('../data_access/models/answer');
const Profile = require('../data_access/models/profile');
const Puzzle = require('../data_access/models/puzzle');
const Maze = require('../data_access/models/maze');
const Hint = require('../data_access/models/hint');

mongoose.connect(`mongodb://${config.dbUsername}:${config.dbPassword}@localhost:27017/maze?authSource=admin`, { useNewUrlParser: true })
  .then(() => {
    console.log('Successfully connected to db');
  })
  .catch((err) => {
    console.log(err);
    console.log('Error connecting to db');
  });

function createPuzzle() {
  return new Promise(async(resolve) => {
    const puzzle = new Puzzle({ title: 'P1', description: '<h1>Problem 1</h1>', feedback: '<h1>Go to Problem 2</h1>' });
    const savedPuzzle = await puzzle.save();
    resolve(savedPuzzle);
  });
}

function createMaze() {
  return new Promise(async(resolve) => {
    let puzzle = await createPuzzle();
    const maze = new Maze();
    maze.puzzles.push(puzzle);
    const savedMaze = await maze.save();
    console.log(savedMaze);
    savedMaze.addPuzzle(puzzle);
    resolve(savedMaze);
  });
}

function createAnswer() {
  return new Promise(async(resolve, reject) => {
    let maze = await createMaze();
    let answer = new Answer({ text: 'P1 Answer', mazePuzzle: maze.puzzles[0] });
    let savedAnswer = await answer.save();
    resolve(savedAnswer);
  });
}

createAnswer().then(() => {
  console.log('Done');
});
