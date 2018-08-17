const express = require('express');

const passport = require('../common/passport');
const Profile = require('../data_access/models/profile');
const Hint = require('../data_access/models/hint');
const Answer = require('../data_access/models/answer');
const MazePuzzle = require('../data_access/models/mazePuzzle');

const app = express();

app.use(passport.isAuthenticated);


app.use(async(req, res, next) => {
  const user = req.user;
  req.profile = await Profile.findUserProfile(user);
  next();
});

app.get('/', (req, res, next) => {
  let mazePuzzles = req.profile.viewedPuzzles;
  res.render('maze/puzzlesList', { mazePuzzles });
});


app.get('/puzzles/:puzzleId', async(req, res) => {
  const profile = req.profile;
  let status = 'viewed';
  let mazePuzzle = req.profile.viewedPuzzles.find(p => p.id === req.params.puzzleId);
  if (mazePuzzle) {
    if (await profile.hasSolved(mazePuzzle))
      status = 'solved';
    let answers = await profile.getAnswers(mazePuzzle);
    const hints = await Hint.find({ mazePuzzle, profile });
    console.log(answers)
    return res.render('maze/puzzle', {
      mazePuzzle, hints, answers, status
    });
  } else {
    mazePuzzle = await MazePuzzle.findById(req.params.puzzleId).populate('puzzle');
    if (!mazePuzzle)
      return res.sendStatus(404);
    if (!await profile.viewPuzzle(mazePuzzle))
      return res.render('common/error', { error: { message: 'You have to solve prerequisites of this puzzle first!' } });
    return res.render('maze/puzzle', {
      mazePuzzle, hints:[], answers: [], status
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
  const hint = await Hint.findOne({ code });
  if (!hint)
    return res.render('common/error', { error: { message: 'Hint code is invalid!' } });
  if (hint.status !== 'unused')
    return res.render('common/error', { error: { message: 'Hint code has been already used!' } });
  hint.mazePuzzle = req.params.puzzleId;
  hint.profile = req.profile;
  hint.question = question;
  hint.status = 'asked';
  await hint.save();
  res.redirect(`/maze/puzzles/${req.params.puzzleId}`);
});

module.exports = app;
