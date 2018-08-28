const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SALT_WORK_FACTOR = 10;

const Schema = mongoose.Schema;

const userSchema = new Schema({
  _id: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    alias: 'username'
  },
  name: {
    type: String,
    required: true
  },
  ip: {
    type: String
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin']
  }
}, { _id: false });

userSchema.pre('save', function(next) {
  let user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
      if (err) return reject(err);
      resolve(isMatch);
    });
  });
};

userSchema.methods.enrollToMaze = function(maze) {
  const user = this;
  return new Promise(async (resolve, reject) => {
    user.profile = new mongoose.model('Profile')({ maze });
    await user.save();
  });
};

userSchema.virtual('isAdmin').get(function() {
  return this.role === 'admin';
});

module.exports = mongoose.model('User', userSchema);
