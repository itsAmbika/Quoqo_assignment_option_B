const ExpressError = require('../utils/ExpressError');
const requestModel = require('../models/requestModel');
const userModel = require('../models/userModel');
const { ALERT_MESSAGES, REQUEST_STATUSES } = require('../constants/appConstants');

const getRequestFormData = async () => {
  const users = await userModel.findAllBasic();
  return { users, statuses: REQUEST_STATUSES };
};

const validateRequestInput = async ({ title, userId }) => {
  if (!title || !userId) {
    throw new ExpressError(400, ALERT_MESSAGES.invalidRequestInput);
  }

  const userExists = await userModel.existsById(userId);
  if (!userExists) {
    throw new ExpressError(400, ALERT_MESSAGES.invalidRequestUser);
  }
};

const getRequestByIdOrFail = async (id) => {
  const request = await requestModel.findById(id);

  if (!request) {
    throw new ExpressError(404, ALERT_MESSAGES.requestNotFound);
  }

  return request;
};

module.exports = {
  getRequestByIdOrFail,
  getRequestFormData,
  validateRequestInput,
};
