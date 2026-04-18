const requestModel = require('../models/requestModel');
const requestService = require('../services/requestService');
const { ROUTES, VIEW_TITLES } = require('../constants/appConstants');

exports.listRequests = async (req, res) => {
  const requests = await requestModel.findAllWithUsers();

  res.render('requests', {
    title: VIEW_TITLES.requests,
    requests,
  });
};

exports.renderNewForm = async (req, res) => {
  const { users } = await requestService.getRequestFormData();

  res.render('new', {
    title: VIEW_TITLES.newRequest,
    users,
  });
};

exports.createRequest = async (req, res) => {
  const { title, description, userId } = req.body;
  await requestService.validateRequestInput({ title, userId });
  await requestModel.create({ title, description, userId });
  res.redirect(ROUTES.requests);
};

exports.renderEditForm = async (req, res) => {
  const request = await requestService.getRequestByIdOrFail(req.params.id);
  const { users, statuses } = await requestService.getRequestFormData();

  res.render('edit', {
    title: VIEW_TITLES.editRequest,
    request,
    users,
    statuses,
  });
};

exports.updateRequest = async (req, res) => {
  const { title, description, status, userId } = req.body;

  await requestModel.updateById(req.params.id, {
    title,
    description,
    status,
    userId,
  });

  res.redirect(ROUTES.requests);
};

exports.deleteRequest = async (req, res) => {
  await requestModel.deleteById(req.params.id);
  res.redirect(ROUTES.requests);
};
