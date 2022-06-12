const Seat = require('../models/seat.js');

exports.create = async (req, res) => {
  const newSeat = new Seat(req.body);

  try {
    const saved = await newSeat.save();
    res.status(200).json(saved);
  } catch (err) {
    res.status(500).json(err);
  }
};
