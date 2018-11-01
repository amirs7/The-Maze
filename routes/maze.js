const express = require('express');

const passport = require('../common/passport');
const Profile = require('../data_access/models/profile');
const Answer = require('../data_access/models/answer');
const HintCode = require('../data_access/models/hintCode');
const MazePuzzle = require('../data_access/models/mazePuzzle');

const app = express();

app.use(passport.isAuthenticated);


app.use(async(req, res, next) => {
  const user = req.user;
  req.profile = await Profile.findUserProfile(user);
  if(!req.profile)
    return res.redirect('/maze');
  next();
});

app.get('/leaderboard', async(req, res, next) => {
  let profiles = await Profile.find({}).populate(['answers', 'user']);
  let mazePuzzles = await MazePuzzle.find({});
  let arr = [];
  profiles = await calcAllStages(profiles, mazePuzzles);
  profiles = profiles.sort((a, b) => a.stage < b.stage);
  res.render('maze/leaderboard', { profiles });
});

app.get('/', (req, res, next) => {
  let mazePuzzles = [];
  if (req.profile)
    mazePuzzles = req.profile.viewedPuzzles;
  else
    return res.redirect('/user/login');
  res.render('maze/puzzlesList', { mazePuzzles });
});

function getMaximumHintStepOfPuzzle(mazePuzzleId, profileId) {
  return new Promise((resolve, reject) => {
    HintCode.aggregate([{
      $match: {
        mazePuzzle: mazePuzzleId,
        profile: profileId
      }
    }, {
      $group: {
        _id: { m: '$mazePuzzle', p: '$profile' },
        step: {
          $max: '$step'
        }
      }
    }
    ], (err, data) => {
      console.log(data);
      if(!data || !data[0])
        return resolve(0);
      return resolve(data[0].step);
    });
  });
}

app.get('/puzzles/:puzzleId', async(req, res) => {
  const profile = req.profile;
  let status = 'viewed';
  let mazePuzzle = req.profile.viewedPuzzles.find(p => p.id === req.params.puzzleId);
  if (mazePuzzle) {
    if (await profile.hasSolved(mazePuzzle))
      status = 'solved';
    let answers = await profile.getAnswers(mazePuzzle);
    let clue = {};
    if (mazePuzzle.nextPuzzle.clues.length > 0)
      clue = mazePuzzle.nextPuzzle.clues[0 % mazePuzzle.nextPuzzle.clues.length];
    console.log(await getMaximumHintStepOfPuzzle(mazePuzzle._id, profile._id));
    const hints = [];
    return res.render('maze/puzzle', {
      mazePuzzle, hints, answers, status, clue
    });
  } else {
    mazePuzzle = await MazePuzzle.findById(req.params.puzzleId).populate('puzzle');
    if (!mazePuzzle)
      return res.sendStatus(404);
    if (!await profile.viewPuzzle(mazePuzzle))
      return res.render('common/error', { error: { message: 'You have to solve prerequisites of this puzzle first!' } });
    return res.render('maze/puzzle', {
      mazePuzzle, hints: [], answers: [], status
    });
  }
});

app.post('/puzzles/:puzzleId/answer', async(req, res) => {
  let profile = req.profile;
  if (!req.body || !req.body.answerText)
    return res.sendStatus(400);
  profile.addAnswer(req.params.puzzleId, req.body.answerText);
  res.redirect(`/maze/puzzles/${req.params.puzzleId}`);
});

app.post('/puzzles/:puzzleId/hint', async(req, res) => {
  const code = req.body.code;
  const question = req.body.question;
  if (!code || !question)
    return res.sendStatus(400);
  const hint = await HintCode.findOne({ code });
  if (!hint)
    return res.render('common/error', { error: { message: 'Hint code is invalid!' } });
  if (hint.step !== -1)
    return res.render('common/error', { error: { message: 'Hint code has been already used!' } });
  hint.mazePuzzle = req.params.puzzleId;
  hint.profile = req.profile;
  console.log(await getMaximumHintStepOfPuzzle(req.params.puzzleId, req.profile._id)+5);
  hint.step = await getMaximumHintStepOfPuzzle(req.params.puzzleId, req.profile._id) + 1;
  await hint.save();
  res.redirect(`/maze/puzzles/${req.params.puzzleId}`);
});

module.exports = app;
