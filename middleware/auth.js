const ExpressError = require('../utils/ExpressError');

exports.isLoggedIn = (req, res, next) => {
  if (!req.session.userId) {
    req.session.returnTo = req.originalUrl;
    return res.redirect('/login');
  }

  next();
};

exports.requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.session.userRole)) {
      throw new ExpressError(403, `Requires one of: ${allowedRoles.join(', ')}`);
    }

    next();
  };
};

exports.loginUser = (req, user) => {
  req.session.userId = user.id;
  req.session.userRole = user.role;
  req.session.userEmail = user.email;
};

exports.logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.redirect('/requests');
    }

    res.clearCookie('connect.sid');
    res.redirect('/requests');
  });
};
