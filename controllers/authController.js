const auth = require('../middleware/auth');
const authService = require('../services/authService');
const { ALERT_MESSAGES, ROUTES, VIEW_TITLES } = require('../constants/appConstants');

exports.renderLogin = (req, res) => {
  res.render('login', { title: VIEW_TITLES.login });
};

exports.login = async (req, res) => {
  const { email, user } = await authService.authenticateUser(req.body);

  if (user) {
    auth.loginUser(req, user);

    const returnTo = req.session.returnTo || ROUTES.requests;
    delete req.session.returnTo;
    await authService.saveSession(req);
    return res.redirect(returnTo);
  }

  res.locals.alerts.error.push(ALERT_MESSAGES.invalidCredentials);
  res.status(401).render('login', { title: VIEW_TITLES.login, formData: { email } });
};

exports.logout = (req, res) => {
  auth.logoutUser(req, res);
};
