const Trip = require("../models/trip.js");
// const Vehicle = require("../models/vehicle.js");
// const Route = require("../models/route");
// const Enterprise = require("../models/enterprise");
// const Ticket = require("../models/ticket");
// const UserTicket = require("../models/user_ticket");
// const OfflineTicket = require("../models/offline_phone_ticket");
// const Rules = require("../models/rule");

exports.getAll = async (req, res) => {
  try {
    const trips = await Trip.find();
    res.status(200).json(trips);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.getById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    res.status(200).json(trip);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// exports.fetchAll = async (req, res) => {
//   try {
//     let payload = [];

//     const trips = await Trip.find();
//     const vehicles = await Vehicle.find();
//     const routes = await Route.find();
//     const enterprise = await Enterprise.find();
//     const tickets = await Ticket.find();
//     const rules = await Rules.find();
//     trips
//       .filter((trip) => new Date(trip.startDate - 24*3600*1000*rules[0].book) >= Date.now())
//       .map((trip) => {
//         let result = {};
//         result.trip = trip;
//         vehicles
//           .filter((item) => trip.idVehicle.equals(item._id))
//           .map((item) => (result.vehicle = item));
//         routes
//           .filter((item) => trip.idRoute.equals(item._id))
//           .map((item) => (result.route = item));
//         enterprise
//           .filter((item) => result.route.idEnterprise.equals(item._id))
//           .map((item) => (result.enterprise = item));
//         tickets
//           .filter((item) => item.idTrip.equals(trip._id))
//           .map((item) => {
//             result.ticket = item;
//           });
//         payload.push(result);
//       });
//     res.status(200).json(payload);
//   } catch (err) {
//     res.status(500).json({ error: err });
//   }
// };

exports.create = async (req, res) => {
  const newTrip = new Trip(req.body);

  try {
    const saved = await newTrip.save();
    res.status(200).json(saved);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await Trip.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.deleteById = async (req, res) => {
  try {
    await Trip.findByIdAndDelete(req.params.id);
    res.status(200).json("Has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
};

// exports.getInforbyID = async (req, res) => {
//   try {
//     const trip = await Trip.findById(req.params.id)
//       .populate({ path: "idVehicle", populate: "idEnterprise" })
//       .populate("idRoute");
//     const tickets = await Ticket.findOne({ idTrip: trip._id });
//     var listTicket = [];
//     for (var i = 0; i < tickets.quantity.length; i++) {
//       if (tickets.quantity[i] === true) {
//         let onlTi = await UserTicket.findOne({
//           idTicket: tickets._id,
//           canceled: false,
//           seatNumber: i + 1,
//         }).populate("idUser");
//         let offTi = await OfflineTicket.findOne({
//           idTicket: tickets._id,
//           seatNumber: `${i + 1}`,
//         });
//         if (onlTi) {
//           let temp = JSON.parse(JSON.stringify(onlTi));
//           temp.type = "OnlineTicket";
//           listTicket.push(temp);
//         } else if (offTi) {
//           let temp = JSON.parse(JSON.stringify(offTi));
//           temp.type = "OfflineTicket";
//           listTicket.push(temp);
//         } else {
//           const unknow = {
//             idTicket: tickets._id,
//             seatNumber: i + 1,
//             Name: "Unknow",
//             type: "UnknowTicket",
//           };
//           listTicket.push(unknow);
//         }
//       }
//     }
//     res.status(200).json({
//       trip: trip,
//       tickets: tickets,
//       listTicket: listTicket,
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: err });
//   }
// };
