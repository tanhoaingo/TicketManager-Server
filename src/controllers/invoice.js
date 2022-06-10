const Invoice = require('../models/invoice.js');

exports.create = async (req, res) => {
  const newInvoice = new Invoice(req.body);

  try {
    const saved = await newInvoice.save();
    res.status(200).json(saved);
  } catch (err) {
    res.status(500).json(err);
  }
};
