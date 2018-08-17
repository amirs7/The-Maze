const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const hintSchema = new Schema({
  code: {
    type: String,
    required: true
  },
  question: {
    type: String
  },
  mazePuzzle: {
    type: Schema.Types.ObjectId,
    ref: 'MazePuzzle'
  },
  profile: {
    type: Schema.Types.ObjectId,
    ref: 'Profile'
  },
  answer: {
    type: String
  },
  status: {
    type: String,
    default: 'unused',
    enum: ['unused', 'asked', 'answered']
  }
});

module.exports = mongoose.model('Hint', hintSchema);
