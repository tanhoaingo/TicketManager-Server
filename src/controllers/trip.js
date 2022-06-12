const Trip = require('../models/trip.js');
const Route = require('../models/route.js');
const Vehicle = require('../models/vehicle.js');
const Ticket = require('../models/ticket.js');
const Enterprise = require('../models/enterprise');
const WagonTicket = require('../models/wagonTicket.js');
const Seat = require('../models/seat.js');
const Wagon = require('../models/wagons.js');
const City = require('../models/city.js');
const Rule = require('../models/rule.js');
const CusTicket = require('../models/cusTicket.js');
const UserBooking = require('../models/userBooking');
// const UserTicket = require("../models/user_ticket");
// const OfflineTicket = require("../models/offline_phone_ticket");
// const Rules = requfire("../models/rule");

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
//       .filter((trip) => new Date(trip.startDate - 24 * 3600 * 1000 * rules[0].book) >= Date.now())
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

exports.fetchAll = async (req, res) => {
  try {
    let payload = [];

    const { startIndex, endIndex, startDate } = req.body;

    const trips = await Trip.find();
    const routes = await Route.find();
    const tickets = await Ticket.find();
    const vehicles = await Vehicle.find();
    const enterprises = await Enterprise.find();
    const wagonTickets = await WagonTicket.find();
    const seats = await Seat.find();
    const wagons = await Wagon.find();
    const cities = await City.find();
    const rule = await Rule.findOne();
    const curHour = new Date().getHours();
    const curDay = new Date().getDay();
    const curMonth = new Date().getMonth();
    const curYear = new Date().getYear();

    const filteredRoutes = routes.filter(route => {
      let isValid = true;
      if (`${curYear}/${curMonth}/${curDay}` === startDate) {
        isValid =
          isValid &&
          (route.endLocation - route.startLocation) * (endIndex - startIndex) > 0 &&
          route.startTime - curHour > rule.book;
        return isValid;
      } else {
        isValid =
          isValid && (route.endLocation - route.startLocation) * (endIndex - startIndex) > 0;
        return isValid;
      }
    });

    const filteredTrips = trips.filter(trip => {
      for (let route of filteredRoutes) {
        if (trip.idRoute.toString() == route._id.toString()) {
          let isValid = true;
          isValid = isValid && trip.startDate == new Date(startDate).toString();

          return isValid;
        }
      }
    });

    let totalCities = 0;
    cities.map(() => (totalCities += 1));

    filteredTrips.map(trip => {
      let result = {};
      // let arrWagonTicket = [];
      let arrSeat = [];
      let countSeat = 0;
      result.idTrip = trip._id;
      result.fixed_price = trip.fixed_price * Math.abs(startIndex - endIndex);
      vehicles
        .filter(item => trip.idVehicle.equals(item._id))
        .map(item => {
          (result.idTrain = item.idTrain), (result.typeOfSpeed = item.typeOfSpeed);
          for (let i in item.wagons) {
            for (let w of wagons) {
              if (w.idWagon == item.wagons[i]) {
                countSeat = countSeat += w.totalSeat;
              }
            }
          }
        });
      routes
        .filter(item => trip.idRoute.equals(item._id))
        .map(item => {
          (result.startTime = item.startTime), (result.totalTime = item.totalTime);
          enterprises
            .filter(enterprise => item.idEnterprise.equals(enterprise._id))
            .map(enterprise => (result.name = enterprise.name));
        });

      tickets
        .filter(item => item.idTrip.equals(trip._id))
        .map(item => {
          // result.ticket = item
          wagonTickets
            .filter(wagon => wagon.idTicket.equals(item._id))
            .map(wagon => {
              seats
                .filter(seat => seat.idWagonTicket.equals(wagon._id))
                .map(seat => {
                  arrSeat.push(seat);
                });
            });
          result.totalSeat = countSeat;
          result.seatBought = arrSeat.length;
          result.s =
            (endIndex - startIndex > 0
              ? (result.totalTime / totalCities) * startIndex
              : (result.totalTime / totalCities) * (totalCities - startIndex - 1)) +
            result.startTime;
          result.e =
            result.startTime +
            (result.totalTime / totalCities) *
              (endIndex - startIndex > 0 ? endIndex - startIndex : startIndex - endIndex);
        });
      payload.push(result);
    });

    res.status(200).json(payload);
  } catch (err) {
    res.status(500).json({ error: err });
    console.log(err);
  }
};

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
    res.status(200).json('Has been deleted');
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getInfoById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate({
        path: 'idRoute',
        populate: 'idEnterprise',
      })
      .populate('idSteersman')
      .populate('idVehicle');

    const ticket = await Ticket.findOne({ idTrip: trip._id });
    const wagonTicket = await WagonTicket.find({ idTicket: ticket._id });

    let arrWagonTicket = [];
    for (let w of wagonTicket) {
      let arrSeat = [];
      let seats = await Seat.find({ idWagonTicket: w._id });
      for (let seat of seats) {
        let cusTicket = await CusTicket.findOne({ idSeat: seat._id }).populate('idInvoice');
        let userBooking = await UserBooking.findOne({ idInvoice: cusTicket.idInvoice._id });
        arrSeat.push({
          cusTicket,
          seat,
          userBooking,
        });
      }
      arrWagonTicket.push({
        wagonTicket: await w.populate('wagon'),
        seats: arrSeat,
      });
    }

    if (trip) {
      return res.status(200).json({
        success: true,
        tripDetail: trip,
        wagon: wagonTicket,
        wagonTickets: arrWagonTicket,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error,
    });
  }
};
exports.getInfoByIdAndLocation = async (req, res) => {
  try {
    const { startIndex, endIndex } = req.body;

    const trip = await Trip.findById(req.params.id)
      .populate({
        path: 'idRoute',
        populate: 'idEnterprise',
      })
      .populate('idSteersman')
      .populate('idVehicle');

    if (startIndex === endIndex) {
      return res.status(200).json({
        success: false,
        message: 'false input',
      });
    }

    const ticket = await Ticket.findOne({ idTrip: trip._id });
    const wagonTicket = await WagonTicket.find({ idTicket: ticket._id });

    let arrWagonTicket = [];
    for (let w of wagonTicket) {
      let arrSeat = [];
      let seats = await Seat.find({ idWagonTicket: w._id });
      for (let seat of seats) {
        let cusTicket = await CusTicket.findOne({ idSeat: seat._id }).populate('idInvoice');
        let userBooking = await UserBooking.findOne({ idInvoice: cusTicket.idInvoice._id });
        if (startIndex < endIndex) {
          const checkDontConflix =
            (seat.startIndex < startIndex && seat.endIndex <= startIndex) ||
            (seat.endIndex > endIndex && seat.startIndex >= endIndex);
          if (!checkDontConflix) {
            arrSeat.push({
              cusTicket,
              seat,
              userBooking,
            });
          }
        } else {
          if (
            (seat.startIndex > startIndex && seat.endIndex >= startIndex) ||
            (seat.endIndex < endIndex && seat.startIndex <= endIndex)
          ) {
            arrSeat.push({
              cusTicket,
              seat,
              userBooking,
            });
          }
        }
      }
      arrWagonTicket.push({
        wagonTicket: await w.populate('wagon'),
        seats: arrSeat,
      });
    }

    if (trip) {
      return res.status(200).json({
        success: true,
        tripDetail: trip,
        wagon: wagonTicket,
        wagonTickets: arrWagonTicket,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error,
    });
  }
};
// exports.getInforbyID = async (req, res) => {
//   try {
//     const trip = await Trip.findById(req.params.id)
//       .populate({ path: 'idVehicle', populate: 'idEnterprise' })
//       .populate('idRoute');
//     const tickets = await Ticket.findOne({ idTrip: trip._id });
//     var listTicket = [];
//     for (var i = 0; i < tickets.quantity.length; i++) {
//       if (tickets.quantity[i] === true) {
//         let onlTi = await UserTicket.findOne({
//           idTicket: tickets._id,
//           canceled: false,
//           seatNumber: i + 1,
//         }).populate('idUser');
//         let offTi = await OfflineTicket.findOne({
//           idTicket: tickets._id,
//           seatNumber: `${i + 1}`,
//         });
//         if (onlTi) {
//           let temp = JSON.parse(JSON.stringify(onlTi));
//           temp.type = 'OnlineTicket';
//           listTicket.push(temp);
//         } else if (offTi) {
//           let temp = JSON.parse(JSON.stringify(offTi));
//           temp.type = 'OfflineTicket';
//           listTicket.push(temp);
//         } else {
//           const unknow = {
//             idTicket: tickets._id,
//             seatNumber: i + 1,
//             Name: 'Unknow',
//             type: 'UnknowTicket',
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
