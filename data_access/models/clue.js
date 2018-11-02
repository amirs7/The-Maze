const mongoose = require('mongoose');
const QRCode = require('qrcode');
const config = require('../../config');

const Schema = mongoose.Schema;

const clueSchema = new Schema({
  name: String,
  locationIndex: {
    type: String
  },
  qrImage: {
    type: String
  },
  html: {
    type: String
  },
  mazePuzzle: {
    type: Schema.Types.ObjectId,
    ref: 'MazePuzzle'
  }
});
clueSchema.pre('save', async function(next) {
  let clue = this;
  if (!(clue.isModified('html') | clue.isModified('locationIndex'))) return next();
  let clueURL = `${config.hostname}/maze/clues/${clue.id}`;
  clue.qrImage = await QRCode.toDataURL(clueURL, { errorCorrectionLevel: 'L', version: 4, maskPattern: 7 });
  next();
});

module.exports = mongoose.model('Clue', clueSchema);
