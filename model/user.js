const { name } = require('ejs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, minlength: 4 },
    github: {
      username: String,
      photo: String,
    },
    google: {
      photo: String,
    },
    providers: [String],
  },
  { timestamps: true }
);

userSchema.pre('save', function (next) {
  if (this.password && this.isModified('password')) {
    bcrypt
      .hash(this.password, 10)
      .then((pass) => {
        this.password = pass;
        next();
      })
      .catch((err) => next(err));
  } else {
    next();
  }
});

userSchema.methods.verifyPassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, result) => {
    return cb(result, err);
  });
};

var User = mongoose.model('User', userSchema);
module.exports = User;
