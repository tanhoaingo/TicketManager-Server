const { Enterprise } = require('../models');

const EnterpriseController = {
  getAll: async (req, res) => {
    try {
      const enterpriseList = await Enterprise.find();

      res.status(200).json({ enterpriseList });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  },
};

module.exports = EnterpriseController;
