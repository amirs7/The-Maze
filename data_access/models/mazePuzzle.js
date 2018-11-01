const mongoose = require('mongoose');
const QRCode = require('qrcode');

const config = require('../../config');

const Schema = mongoose.Schema;

const mazePuzzleSchema = new Schema({
  puzzle: {
    type: Schema.Types.ObjectId,
    ref: 'Puzzle',
    required: true
  },
  qrImage: {
    type: String
  },
  feedbacks: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Feedback'
    }
  ],
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

mazePuzzleSchema.pre('save', async function(next) {
  let mazePuzzle = this;
  if (!mazePuzzle.isModified('puzzle')) return next();
  let mazePuzzleURL = `${config.hostname}/maze/puzzles/${mazePuzzle.id}`;
  console.log(mazePuzzleURL);
  mazePuzzle.qrImage = await QRCode.toDataURL(mazePuzzleURL, { errorCorrectionLevel: 'L', version: 4, maskPattern: 7 });
  next();
});

module.exports = mongoose.model('MazePuzzle', mazePuzzleSchema);
