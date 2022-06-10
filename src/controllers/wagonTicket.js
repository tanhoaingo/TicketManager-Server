const WagonTicket = require('../models/wagonTicket');
const Wagon = require('../models/wagons');
const Trip = require('../models/trip.js');
const Ticket = require('../models/ticket.js');
const Seat = require('../models/seat.js');
const Vehical = require('../models/vehicle');

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

    const { idTrip } = req.body;

    const wagonTickets = await WagonTicket.find();

    const wagon = await Wagon.find();

    const trip = await Trip.findOne({ _id: idTrip });

    const ticket = await Ticket.findOne({ idTrip: trip._id });

    const seats = await Seat.find();
    const vehicals = await Vehical.find();

    if (ticket) {
      const filteredWagonTickets = wagonTickets.filter(wagonTickets => {
        return wagonTickets.idTicket.equals(ticket._id);
      });
      // res.status(200).json(filteredWagonTickets);

      filteredWagonTickets.map(wagonTicket => {
        const filteredSeats = seats.filter(seat => {
          let isValid = true;
          isValid = isValid && seat.idWagonTicket.equals(wagonTicket._id);
          return isValid;
        });
        let wagonType = '';
        for (let w of wagon) {
          if (wagonTicket.wagon.equals(w._id)) wagonType = w.idWagon;
        }

        let currentVehical = '';
        for (let v of vehicals) {
          if (trip.idVehicle.equals(v._id)) currentVehical = v.idTrain;
        }

        payload.push({ ...wagonTicket._doc, filteredSeats, wagonType, currentVehical });
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
