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
  return new Promise(async (resolve, reject) => {
    try {
      const mazePuzzle = new MazePuzzle({ puzzle });
      resolve(await mazePuzzle.save());
    } catch (error) {
      console.log(`[MONGO_ERROR]: ${error}`);
      reject(error);
    }
  });
};

module.exports = mongoose.model('Maze', mazeSchema);
