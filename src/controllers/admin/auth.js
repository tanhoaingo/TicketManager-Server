const { User } = require('../../models');

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
};

module.exports = AuthController;
