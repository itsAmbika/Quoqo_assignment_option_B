const ExpressError = require('../utils/ExpressError');
const requestModel = require('../models/requestModel');
const userModel = require('../models/userModel');

const REQUEST_STATUSES = ['pending', 'in_review', 'approved', 'rejected', 'completed'];

exports.listRequests = async (req, res) => {
  const requests = await requestModel.findAllWithUsers();

  res.render('requests', {
    title: 'Workflow Requests',
    requests,
  });
};

exports.renderNewForm = async (req, res) => {
  const users = await userModel.findAllBasic();

  res.render('new', {
    title: 'New Request',
    users,
  });
};

exports.createRequest = async (req, res) => {
  const { title, description, userId } = req.body;

  if (!title || !userId) {
    throw new ExpressError(400, 'Title and user are required');
  }

  const userExists = await userModel.existsById(userId);
  if (!userExists) {
    throw new ExpressError(400, 'Selected user does not exist');
  }

  await requestModel.create({ title, description, userId });
  res.redirect('/requests');
};

exports.renderEditForm = async (req, res) => {
  const request = await requestModel.findById(req.params.id);
  if (!request) {
    throw new ExpressError(404, 'Request not found');
  }

  const users = await userModel.findAllBasic();

  res.render('edit', {
    title: 'Edit Request',
    request,
    users,
    statuses: REQUEST_STATUSES,
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

  res.redirect('/requests');
};

exports.deleteRequest = async (req, res) => {
  await requestModel.deleteById(req.params.id);
  res.redirect('/requests');
};
