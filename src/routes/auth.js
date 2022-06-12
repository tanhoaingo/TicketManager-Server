const express = require('express');
const { signup, signin, getNewUser } = require('../controllers/auth');
const {
  validateSignupRequest,
  isRequestValidated,
  validateSigninRequest,
} = require('../validators/auth');
// const { requireSignin } = require("../common-middleware/index")
const router = express.Router();

router.post('/getNewUser', getNewUser);

router.post('/signin', validateSigninRequest, isRequestValidated, signin);

router.post('/signup', validateSignupRequest, isRequestValidated, signup);

module.exports = router;
