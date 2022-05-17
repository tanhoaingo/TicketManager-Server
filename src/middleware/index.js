const jwt = require('jsonwebtoken');
const { Role } = require('../appConstants');

exports.requireSignin = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } else {
    return res.status(401).json({ message: 'Authorization required' });
  }
};

exports.userMiddleware = (req, res, next) => {
  if (req.user.role !== Role.USER) {
    return res.status(403).json({ message: 'User access denied' });
  }
  next();
};

exports.adminMiddleware = (req, res, next) => {
  if (req.user.role !== Role.ADMIN) {
    return res.status(403).json({ messgae: 'Admin access denied' });
  }
  next();
};
