const Ticket = require('../models/ticket.js');

exports.create = async (req, res) => {
  const newTicket = new Ticket(req.body);

  try {
    const saved = await newTicket.save();
    res.status(200).json(saved);
  } catch (err) {
    res.status(500).json(err);
  }
};
