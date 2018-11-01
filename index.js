const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);
const methodOverride = require('method-override');
const http = require('http');
const helmet = require('helmet');

const mailer = require('./common/mailer');
const User = require('./data_access/models/user');

const routes = require('./routes');
const config = require('./config');
const passport = require('./common/passport');

let connectionURL;
if (config.dbUsername && config.dbPassword)
  connectionURL = `mongodb://${config.dbUsername}:${config.dbPassword}@localhost:27017/maze?authSource=admin`;
else
  connectionURL = 'mongodb://localhost:27017/maze';
mongoose.connect(connectionURL, { useNewUrlParser: true })
  .then(() => {
    console.log('Successfully connected to db');
  })
  .catch((err) => {
    console.log(err);
    console.log('Error connecting to db');
  });

const app = express();
app.use(async() => {
  const users = await User.find();
  users.map((user) => {
    mailer.sendVerificationEmail(user.username);
  });
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(`${__dirname}/public`));
app.use(methodOverride('_method'));
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'keyboard cat',
  store: new mongoStore({ mongooseConnection: mongoose.connection })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(helmet());

app.use((req, res, next) => {
  req.ip = req.headers['x-forwarded-for'] || req.ip;
  console.log(`[REQUEST]: ${req.ip} ${req.method} ${req.path} ${JSON.stringify(req.body)}`);
  next();
});

app.use('/', routes);

const server = http.Server(app);

server.listen(config.serverPort, () => {
  console.log(config);
});
