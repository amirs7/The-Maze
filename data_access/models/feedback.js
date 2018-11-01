const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
  location: {
    type: String
  }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
