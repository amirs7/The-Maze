const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const profileSchema = new Schema({
  stage: {
    type: String,
    required: true
  },
  answers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Answer'
    }
  ]
});

module.exports = mongoose.model('Profile', profileSchema);
