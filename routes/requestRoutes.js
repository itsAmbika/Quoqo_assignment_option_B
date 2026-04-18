const express = require('express');
const wrapAsync = require('../utils/wrapasync');
const auth = require('../middleware/auth');
const requestController = require('../controllers/requestController');

const router = express.Router();

router.get('/', wrapAsync(requestController.listRequests));
router.get('/new', auth.isLoggedIn, wrapAsync(requestController.renderNewForm));
router.post('/', auth.isLoggedIn, wrapAsync(requestController.createRequest));
router.get(
  '/:id/edit',
  auth.isLoggedIn,
  auth.requireRole('admin', 'manager'),
  wrapAsync(requestController.renderEditForm)
);
router.post(
  '/:id/edit',
  auth.isLoggedIn,
  auth.requireRole('admin', 'manager'),
  wrapAsync(requestController.updateRequest)
);
router.post(
  '/:id/delete',
  auth.isLoggedIn,
  auth.requireRole('admin'),
  wrapAsync(requestController.deleteRequest)
);

module.exports = router;
