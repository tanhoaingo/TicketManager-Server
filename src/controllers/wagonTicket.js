const WagonTicket = require('../models/wagonTicket');
const Trip = require('../models/trip.js');
const Ticket = require('../models/ticket.js');
const Seat = require('../models/seat.js');

exports.create = async (req, res) => {
  const newWagonTicket = new WagonTicket(req.body);

  try {
    const saved = await newWagonTicket.save();
    res.status(200).json(saved);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getAll = async (req, res) => {
  try {
    const wagonTicket = await WagonTicket.find();
    res.status(200).json(wagonTicket);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.getAllByIdTrip = async (req, res) => {
  try {
    let payload = [];

    const wagonTickets = await WagonTicket.find();

    const { idTrip } = req.body;

    const trip = await Trip.findOne({ _id: idTrip });

    const ticket = await Ticket.findOne({ idTrip: trip._id });

    const seats = await Seat.find();

    if (ticket) {
      const filteredWagonTickets = wagonTickets.filter(wagonTickets => {
        let isValid = true;
        isValid = isValid && wagonTickets.idTicket.equals(ticket._id);
        return isValid;
      });
      // res.status(200).json(filteredWagonTickets);

      filteredWagonTickets.map(wagonTicket => {
        const filteredSeats = seats.filter(seat => {
          let isValid = true;
          isValid = isValid && seat.idWagonTicket.equals(wagonTicket._id);
          return isValid;
        });

        payload.push({ ...wagonTicket._doc, filteredSeats });
      });
      res.status(200).json(payload);
    } else {
      res.status(500).json('Not Found');
    }
  } catch (err) {
    res.status(500).json({ error: err });
    // console.log(err)
  }
};

exports.getSeatInWagon = async (req, res) => {
  try {
    const { idWagonTicket } = await req.body;

    const wagonTicket = await WagonTicket.findOne({ _id: idWagonTicket });

    const seats = await Seat.find();

    if (wagonTicket) {
      const filteredSeats = seats.filter(seat => {
        let isValid = true;
        isValid = isValid && seat.idWagonTicket.equals(wagonTicket._id);
        return isValid;
      });
      res.status(200).json(filteredSeats);
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
