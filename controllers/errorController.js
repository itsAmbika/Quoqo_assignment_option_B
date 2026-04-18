const ExpressError = require('../utils/ExpressError');
const { ALERT_MESSAGES, VIEW_TITLES } = require('../constants/appConstants');

exports.handleError = (err, req, res, next) => {
  console.error('Server Error:', err);

  let status = 500;
  let message = process.env.NODE_ENV === 'production' ? ALERT_MESSAGES.internalServerError : err.message;

  if (err instanceof ExpressError) {
    status = err.status;
    message = err.message;
  }

  res.locals.alerts = res.locals.alerts || {};
  res.locals.alerts.error = res.locals.alerts.error || [];
  res.locals.alerts.error.push(message);

  res.status(status).render('error', { title: VIEW_TITLES.error, error: message });
};
