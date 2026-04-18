const { Router } = require('express');
const wrapAsync = require('../utils/wrapasync');
const authController = require('../controllers/authController');
const { ROUTES } = require('../constants/appConstants');

const router = Router();

router.get(ROUTES.login, authController.renderLogin);
router.post(ROUTES.login, wrapAsync(authController.login));
router.post(ROUTES.logout, authController.logout);

module.exports = router;
