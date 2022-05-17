const { Enterprise } = require('../models');

const EnterpriseController = {
  getAll: async (req, res) => {
    try {
      const enterprises = await Enterprise.find();

      res.status(200).json(enterprises);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  },

  create: async (req, res) => {
    const newEnterprise = new Enterprise(req.body);

    try {
      const saved = await newEnterprise.save();

      res.status(201).json(saved);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = EnterpriseController;
