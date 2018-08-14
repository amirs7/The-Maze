const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);
const methodOverride = require('method-override');

const routes = require('./routes');
const config = require('./config');
const passport = require('./common/passport');

mongoose.connect(`mongodb://${config.dbUsername}:${config.dbPassword}@localhost:27017/maze?authSource=admin`, { useNewUrlParser: true })
  .then(() => {
    console.log('Successfully connected to db');
  })
  .catch((err) => {
    console.log(err);
    console.log('Error connecting to db');
  });

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'keyboard cat',
  store: new mongoStore({ mongooseConnection: mongoose.connection })
}));
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  let body = req.body;
  console.log(`[REQUEST]: ${req.method} ${req.path} ${JSON.stringify(body)}`);
  next();
});

app.use('/', routes);

app.listen(config.serverPort);
