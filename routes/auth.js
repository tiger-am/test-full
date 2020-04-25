const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();

// /api/auth/login
router.get('/login', authController.login);

module.exports = router;