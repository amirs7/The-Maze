const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const MazePuzzle = require('./mazePuzzle');

const mazeSchema = new Schema({
  puzzles: [{
    type: Schema.Types.ObjectId,
    ref: 'MazePuzzle'
  }]
});

mazeSchema.methods.addPuzzle = function(puzzle) {
  let maze = this;
  return new Promise(async(resolve, reject) => {
    try {
      const mazePuzzle = new MazePuzzle({ puzzle });
      maze.puzzles.push(mazePuzzle);
      await mazePuzzle.save();
      resolve(await maze.save());
    } catch (error) {
      console.log(`[MONGO_ERROR]: ${error}`);
      reject(error);
    }
  });
};

mazeSchema.statics.getInstance = function() {
  return new Promise((resolve, reject) => {
    mongoose.model('Maze').findOne({}).populate({
      path: 'puzzles',
      populate: [{ path: 'puzzle' }, { path: 'prerequisites', populate: { path: 'puzzle' } }]
    }).exec((err, maze) => {
      resolve(maze);
    });
  });
};

module.exports = mongoose.model('Maze', mazeSchema);
