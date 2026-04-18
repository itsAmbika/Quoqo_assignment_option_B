const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const { ALERT_MESSAGES } = require('../constants/appConstants');

const normalizeEmail = (email = '') => email.trim().toLowerCase();

const authenticateUser = async ({ email, password }) => {
  const normalizedEmail = normalizeEmail(email);
  const user = await userModel.findByEmail(normalizedEmail);
  const isValid = user ? await bcrypt.compare(password || '', user.password) : false;

  return {
    email: normalizedEmail,
    user: isValid ? user : null,
  };
};

const saveSession = (req) => {
  return new Promise((resolve, reject) => {
    req.session.save((err) => {
      if (err) {
        reject(new Error(ALERT_MESSAGES.sessionStartFailed));
        return;
      }

      resolve();
    });
  });
};

module.exports = {
  authenticateUser,
  normalizeEmail,
  saveSession,
};
