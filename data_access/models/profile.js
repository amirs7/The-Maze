const mongoose = require('mongoose');

const Answer = require('./answer');
const MazePuzzle = require('./mazePuzzle');

const Schema = mongoose.Schema;

const profileSchema = new Schema({
  stage: {
    type: Number
  },
  user: {
    type: String,
    ref: 'User',
    required: true
  },
  maze: {
    type: Schema.Types.ObjectId,
    ref: 'Maze',
    required: true
  },
  viewedPuzzles: [
    {
      type: Schema.Types.ObjectId,
      ref: 'MazePuzzle'
    }
  ],
  answers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Answer'
    }
  ]
});

profileSchema.methods.addAnswer = function(mazePuzzle, text) {
  let profile = this;
  return new Promise(async(resolve, reject) => {
    const answer = new Answer({ mazePuzzle, text });
    profile.answers.push(answer);
    await answer.save();
    await profile.save();
    resolve();
  });
};

profileSchema.methods.viewPuzzle = function(mazePuzzle) {
  let profile = this;
  return new Promise(async(resolve, reject) => {
    let ps = await Answer.aggregate([
      {
        $match: {
          _id: {
            $in: profile.answers
          }
        }
      },
      {
        $group: {
          _id: 'answeredPuzzleIds',
          puzzles: {
            $addToSet: '$mazePuzzle'
          }
        }
      }
      , {
        $unwind: '$puzzles'
      }
      , {
        $match: {
          puzzles: {
            $in: mazePuzzle.prerequisites
          }
        }
      }
    ]);
    if (ps.length < mazePuzzle.prerequisites.length)
      return resolve(false);
    profile.viewedPuzzles.addToSet(mazePuzzle);
    await profile.save();
    resolve(true);
  });
};

profileSchema.methods.getAnswers = function(mazePuzzle) {
  let profile = this;
  return new Promise(async(resolve) => {
    let ps = await Answer.aggregate([
      {
        $match: {
          _id: {
            $in: profile.answers
          },
          mazePuzzle: mazePuzzle._id
        }
      }
    ]);
    resolve(ps);
  });
};

profileSchema.methods.hasSolved = function(mazePuzzle) {
  let profile = this;
  return new Promise(async(resolve, reject) => {
    let ps = await Answer.aggregate([
      {
        $match: {
          _id: {
            $in: profile.answers
          },
          mazePuzzle: mazePuzzle._id,
          status: 'right'
        }
      }
    ]);
    resolve(ps.length > 0);
  });
};

profileSchema.statics.findUserProfile = function(user) {
  const Profile = this;
  return new Promise(async(resolve, reject) => {
    const profile = await Profile.findOne({ user }).populate('maze')
      .populate({ path: 'viewedPuzzles', populate: { path: 'puzzle' } })
      .populate({ path: 'viewedPuzzles', populate: { path: 'nextPuzzle', populate: { path: 'clues' } } })
      .populate('answers');
    resolve(profile);
  });
};

module.exports = mongoose.model('Profile', profileSchema);
