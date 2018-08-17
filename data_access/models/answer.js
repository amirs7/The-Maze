const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const answerSchema = new Schema({
  text: {
    type: String
  },
  mazePuzzle: {
    type: Schema.Types.ObjectId,
    ref: 'MazePuzzle'
  },
  status: {
    type: String,
    default: 'na',
    enum: ['na', 'right', 'wrong']
  }
});

module.exports = mongoose.model('Answer', answerSchema);
