
const ExpressError = require('./ExpressError');
exports.isLoggedIn = (req, res, next) => {
  if (!req.session.userId) {
    // Save where user was trying to go
    req.session.returnTo = req.originalUrl;
    return res.redirect('/login');
  }
  next();
};

// requireRole: Role-based access control using DB roles
// Usage: requireRole('admin') or requireRole('admin', 'manager')
exports.requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if user role matches allowed
    if (!allowedRoles.includes(req.session.userRole)) {
      // Use your existing ExpressError
      
      throw new ExpressError(403, `Requires one of: ${allowedRoles.join(', ')}`);
    }
    next();
  };
};

// loginUser: Set session after successful login
// Call after bcrypt.compare succeeds
exports.loginUser = (user) => (req) => {
  req.session.userId = user.id;
  req.session.userRole = user.role;
  req.session.userEmail = user.email;
};

// logoutUser: Clear session
exports.logoutUser = (req) => {
  req.session.destroy((err) => {
    if (err) console.error('Logout error:', err);
  });
};

