const express = require('express');
const wrapAsync = require('../utils/wrapasync');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/login', authController.renderLogin);
router.post('/login', wrapAsync(authController.login));
router.post('/logout', authController.logout);

module.exports = router;
