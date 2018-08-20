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

answerSchema.pre('save', async function(next) {
  const answer = this;
  const mazePuzzles = await mongoose.model('MazePuzzle').findById(answer.mazePuzzle).populate('puzzle');
  if (mazePuzzles.puzzle.checkingType === 'online')
    answer.status = answer.text.trim().toLowerCase() === mazePuzzles.puzzle.solution.trim().toLowerCase() ? 'right' : 'wrong';
  next();
});

module.exports = mongoose.model('Answer', answerSchema);
