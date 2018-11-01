const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const clueSchema = new Schema({
  name: String,
  locationIndex: {
    type: String
  },
  html: {
    type: String
  }
});

module.exports = mongoose.model('Clue', clueSchema);
