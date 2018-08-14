const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const puzzleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  solution: {
    type: String
  },
  feedback: {
    type: String
  }
});

module.exports = mongoose.model('Puzzle', puzzleSchema);
