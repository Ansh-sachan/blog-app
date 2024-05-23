var User = require('../model/user');

module.exports = {
  isUserLogged: (req, res, next) => {
    if (req.session && req.session.userId) {
      next();
    } else {
      return res.redirect('/users/login');
    }
  },
  userInfo: (req, res, next) => {
    if (req.session && req.session.userId) {
      User.findById(req.session.userId, 'name email')
        .then((user) => {
          req.user = user;
          res.locals.user = user;
          next();
        })
        .catch((err) => next(err));
    } else {
      req.user = null;
      res.locals.user = null;
      next();
    }
  },
};
