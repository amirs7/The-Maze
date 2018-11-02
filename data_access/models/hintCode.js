const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const hintCodeSchema = new Schema({
  code: {
    type: String,
    required: true
  },
  mazePuzzle: {
    type: Schema.Types.ObjectId,
    ref: 'MazePuzzle'
  },
  profile: {
    type: Schema.Types.ObjectId,
    ref: 'Profile'
  },
  step: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('HintCode', hintCodeSchema);
