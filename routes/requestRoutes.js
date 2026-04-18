const { Router } = require('express');
const wrapAsync = require('../utils/wrapasync');
const auth = require('../middleware/auth');
const requestController = require('../controllers/requestController');
const { ROUTES } = require('../constants/appConstants');

const router = Router();

router.get('/', wrapAsync(requestController.listRequests));
router.get(ROUTES.newRequest, auth.isLoggedIn, wrapAsync(requestController.renderNewForm));
router.post('/', auth.isLoggedIn, wrapAsync(requestController.createRequest));
router.get(
  ROUTES.editRequest,
  auth.isLoggedIn,
  auth.requireRole('admin', 'manager'),
  wrapAsync(requestController.renderEditForm)
);
router.post(
  ROUTES.editRequest,
  auth.isLoggedIn,
  auth.requireRole('admin', 'manager'),
  wrapAsync(requestController.updateRequest)
);
router.post(
  ROUTES.deleteRequest,
  auth.isLoggedIn,
  auth.requireRole('admin'),
  wrapAsync(requestController.deleteRequest)
);

module.exports = router;
