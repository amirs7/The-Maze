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
      ref: 'MazePuzzle'
    }
  ]
});

mazePuzzleSchema.virtual('title').get(function() {
  if (this.puzzle)
    return this.puzzle.title;
  else
    return '';
});

mazePuzzleSchema.pre('remove', async function(next) {
  let mazePuzzle = this;
  await mongoose.model('MazePuzzle').update({ prerequisites: mazePuzzle }, { $pull: { prerequisites: mazePuzzle.id } });
  await mongoose.model('Maze').update({ puzzles: mazePuzzle }, { $pull: { puzzles: mazePuzzle.id } });
  next();
});

module.exports = mongoose.model('MazePuzzle', mazePuzzleSchema);
