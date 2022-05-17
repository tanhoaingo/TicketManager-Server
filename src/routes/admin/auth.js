const express = require('express');
const AuthController = require('../../controllers/admin/auth');
const validator = require('../../validators');

const router = express.Router();

router
  .route('/signup')
  .post(
    validator.validateSignupRequest,
    validator.validateAdminSignupRequest,
    validator.isValidRequest,
    AuthController.signup
  );

module.exports = router;
