const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const userModel = require('../models/userModel');

exports.renderLogin = (req, res) => {
  res.render('login', { title: 'Login' });
};

exports.login = async (req, res) => {
  const email = req.body.email?.trim().toLowerCase() || '';
  const password = req.body.password || '';
  const user = await userModel.findByEmail(email);

  if (user && await bcrypt.compare(password, user.password)) {
    auth.loginUser(req, user);

    const returnTo = req.session.returnTo || '/requests';
    delete req.session.returnTo;

    return req.session.save((err) => {
      if (err) {
        return res.status(500).render('error', {
          title: 'Error',
          error: 'Unable to start your session'
        });
      }

      res.redirect(returnTo);
    });
  }

  res.locals.alerts.error.push('Invalid email/password');
  res.status(401).render('login', { title: 'Login', formData: { email } });
};

exports.logout = (req, res) => {
  auth.logoutUser(req, res);
};
