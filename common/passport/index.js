const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../../data_access/models/user');

passport.use(new LocalStrategy(
  ((username, password, done) => {
    User.findOne({ _id: username }, (err, user) => {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.comparePassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  })
));

passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.isAuthenticated = (req, res, next) => {
  if (req.user) return next();
  return res.redirect('/user/login');
};

passport.isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) return next();
  return res.render('common/403');
};

module.exports = passport;
