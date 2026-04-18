const { Router } = require('express');
const authRoutes = require('./authRoutes');
const requestRoutes = require('./requestRoutes');
const { ROUTES } = require('../constants/appConstants');

const router = Router();

router.use(authRoutes);
router.use(ROUTES.requests, requestRoutes);

module.exports = router;
