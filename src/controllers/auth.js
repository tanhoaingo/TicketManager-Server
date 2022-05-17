const { User } = require('../models');
const jwt = require('jsonwebtoken');
const { Role } = require('../appConstants');

const AuthController = {
  signup: async (req, res) => {
    const newUser = new User(req.body);

    try {
      const saved = await newUser.save();

      res.status(201).json(saved);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  adminSignup: async (req, res) => {
    const newUser = new User(req.body);
    newUser.role = Role.ADMIN;

    try {
      const saved = await newUser.save();

      res.status(201).json(saved);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  signin: async (req, res) => {
    User.findOne({ email: req.body.email }).exec((error, user) => {
      if (error) res.status(400).json({ error });

      if (user) {
        if (user.authenticate(req.body.password)) {
          const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '24h',
          });

          res.status(200).json({
            user: user,
            token: token,
            message: 'Login successfully <3',
          });
        } else {
          res.status(401).json({
            message: 'Invalid password',
          });
        }
      } else {
        res.status(400).json({ message: 'Something went wrong' });
      }
    });
  },
};

module.exports = AuthController;
