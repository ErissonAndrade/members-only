const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const User = require('./models/users');
const Forums = require('./models/forums');
require('dotenv').config();

const mongoDB = `mongodb+srv://${process.env.USER_ID}:${process.env.USER_PASSWORD}@cluster0.ifu8n0w.mongodb.net/?retryWrites=true&w=majority`;

main().catch((err) => console.error(err));

async function main() {
  console.log('Connecting to DB...');
  await mongoose.connect(mongoDB, { dbName: 'members-only' });
  console.log('Successfully connected to DB!');
}

const indexRouter = require('./routes/index');
const forumsRouter = require('./routes/forums');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// passport strategy setup
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return done(null, false, { message: 'Incorrect username or password' });
      }

      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          return done(null, user);
        }
        return done(null, false, { message: 'Incorrect username or password' });
      });
    } catch (err) {
      return done(err);
    }
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// passport initialization
const sessionSecret = crypto.randomBytes(32).toString('hex');
app.use(session({ secret: sessionSecret, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(async (req, res, next) => {
  res.locals.forums = await Forums.find({ name: { $ne: 'Home' } });
  res.locals.currentUser = req.user;
  next();
});

app.use('/', indexRouter);
app.use('/forums', forumsRouter);

// Bootstrap middleware
app.use('/static', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
