const express = require('express');

const userRoutes = require('./user');
const passport = require('../common/passport');
const Profile = require('../data_access/models/profile');
const MazePuzzle = require('../data_access/models/mazePuzzle');
const adminRoutes = require('./admin');
const mazeRoutes = require('./maze');
const logger = require('../common').logger;
const theAsync = require('async');

const app = express();
app.set('view engine', 'ejs');

app.use('/user', userRoutes);
//app.use('/maze', mazeRoutes);
app.use('/admin', adminRoutes);

app.get('/', (req, res, next) => {
  res.redirect('/user/signup');
  //res.render('landing');
});

app.get('/about', (req, res, next) => {
  res.render('about');
});

app.use('*', passport.isAuthenticated, (req, res) => {
  res.render('landing');
});

function calcStage(mazePuzzles, profile) {
  return new Promise((resolve, reject) => {
    let stage = 0;
    theAsync.each(mazePuzzles, (mazePuzzle, callback) => {
      profile.hasSolved(mazePuzzle).then(ok => {
        if (ok)
          stage++;
        callback();
      });
    }, () => {
      resolve(stage);
    });
  });
}

function calcAllStages(profiles, mazePuzzles) {
  return new Promise((resolve, reject) => {
    theAsync.each(profiles, (profile, callback) => {
      calcStage(mazePuzzles, profile).then(stage => {
        profile.stage = stage;
        callback();
      });
    }, () => {
      resolve(profiles);
    });
  });
}


app.use((err, req, res, next) => {
  logger.error(err);
});

module.exports = app;
