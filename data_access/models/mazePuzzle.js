const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mazePuzzleSchema = new Schema({
  puzzle: {
    type: Schema.Types.ObjectId,
    ref: 'Puzzle',
    required: true
  },
  prerequisites: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Puzzle'
    }
  ]
});

module.exports = mongoose.model('MazePuzzle', mazePuzzleSchema);
