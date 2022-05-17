const { check, body, validationResult } = require('express-validator');

const validator = {
  validateSignupRequest: [
    check('firstName').notEmpty().withMessage('FirstName is required'),
    check('lastName').notEmpty().withMessage('LastName is required'),
    check('email').isEmail().withMessage('Invalid email'),
    check('phoneNumber').isMobilePhone().withMessage('Invalid phone number'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 character'),
  ],

  validateAdminSignupRequest: [body('token').equals('token-to-signup').withMessage('Wrong token')],

  validateSigninRequest: [
    check('email').isEmail().withMessage('Invalid email'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 character'),
  ],

  isValidRequest: [
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(500).json({ errors: errors.array() });
      next();
    },
  ],
};

module.exports = validator;
