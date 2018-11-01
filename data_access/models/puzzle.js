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
  level: {
    type: Number,
    default: 0
  },
  hints: [String],
  checkingType: {
    enum: ['online', 'offline'],
    default: 'online',
    type: String
  }
});

puzzleSchema.pre('remove', async function(next) {
  const puzzle = this;
  const mazePuzzles = await mongoose.model('MazePuzzle').find({ puzzle });
  mazePuzzles.forEach(async(p) => {
    await p.remove();
  });
  next();
});

module.exports = mongoose.model('Puzzle', puzzleSchema);
