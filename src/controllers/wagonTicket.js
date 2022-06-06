const WagonTicket = require('../models/wagonTicket');
const Trip = require('../models/trip.js');
const Ticket = require('../models/ticket.js');
const Seat = require('../models/seat.js');
const user = require('../models/user');
const Vehicle = require('../models/vehicle');
const Wagons = require('../models/wagons');
const cusTicket = require('../models/cusTicket');

exports.create = async (req, res) => {
  const newWagonTicket = new WagonTicket(req.body);

  try {
    const saved = await newWagonTicket.save();
    res.status(200).json(saved);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.createAllWagons = async (req, res) => {
  try {
    let payload = [];
    const { idTrip } = req.body;
    const trip = await Trip.findOne({ _id: idTrip });
    const ticket = await Ticket.findOne({ idTrip: idTrip });
    const vehicle = await Vehicle.findOne({ _id: trip.idVehicle });
    const wagons = await Wagons.find();

    for (let i in vehicle.wagons) {
      for (let w of wagons) {
        if (w.idWagon == vehicle.wagons[i]) {
          const newWagonTicket = new WagonTicket({
            idTicket: ticket._id,
            numOfWagon: i,
            wagon: w._id,
            price: req.body.price,
          });
          const saved = await newWagonTicket.save();
          payload.push(saved);
        }
      }
    }
    res.status(200).json(payload);
  } catch (err) {
    console.log(err);
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

    const cusTickets = await cusTicket.find();

    if (ticket) {
      const filteredWagonTickets = wagonTickets.filter(wagonTickets => {
        let isValid = true;
        isValid = isValid && wagonTickets.idTicket.equals(ticket._id);
        return isValid;
      });

      filteredWagonTickets.map(wagonTicket => {
        const filteredSeats = seats.filter(seat => {
          for (let c of cusTickets) {
            if (c.idSeat.equals(seat._id)) {
              let isValid = true;
              isValid = isValid && seat.idWagonTicket.equals(wagonTicket._id) && !c.isCancel;
              return isValid;
            }
          }
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

exports.getTotalTicket_Sale = async (req, res) => {
  try {
    const { month, year } = req.body;

    const result = await Seat.aggregate([
      {
        $lookup: {
          from: 'wagontickets',
          localField: 'idWagonTicket',
          foreignField: '_id',
          as: 'result',
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              {
                $arrayElemAt: ['$result', 0],
              },
              '$$ROOT',
            ],
          },
        },
      },
      {
        $project: {
          result: 0,
        },
      },
      {
        $lookup: {
          from: 'custickets',
          localField: '_id',
          foreignField: 'idSeat',
          as: 'result',
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              {
                $arrayElemAt: ['$result', 0],
              },
              '$$ROOT',
            ],
          },
        },
      },
      {
        $project: {
          result: 0,
        },
      },
      {
        $match: {
          isCancel: false,
        },
      },
      {
        $project: {
          date: '$createdAt',
          month: {
            $month: '$createdAt',
          },
          year: {
            $year: '$createdAt',
          },
          price: '$price',
        },
      },
      {
        $match: {
          month: month,
          year: year,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m',
              date: '$date',
            },
          },
          totalTicket: {
            $sum: 1,
          },
          totalSale: {
            $sum: '$price',
          },
        },
      },
    ]);

    const canceledTicket = await Seat.aggregate([
      {
        $lookup: {
          from: 'wagontickets',
          localField: 'idWagonTicket',
          foreignField: '_id',
          as: 'result',
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              {
                $arrayElemAt: ['$result', 0],
              },
              '$$ROOT',
            ],
          },
        },
      },
      {
        $project: {
          result: 0,
        },
      },
      {
        $lookup: {
          from: 'custickets',
          localField: '_id',
          foreignField: 'idSeat',
          as: 'result',
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              {
                $arrayElemAt: ['$result', 0],
              },
              '$$ROOT',
            ],
          },
        },
      },
      {
        $project: {
          result: 0,
        },
      },
      {
        $match: {
          isCancel: true,
        },
      },
      {
        $project: {
          date: '$createdAt',
          month: {
            $month: '$createdAt',
          },
          year: {
            $year: '$createdAt',
          },
          price: '$price',
        },
      },
      {
        $match: {
          month: month,
          year: year,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m',
              date: '$date',
            },
          },
          totalCanceledTicket: {
            $sum: 1,
          },
        },
      },
    ]);

    const newUser = await user.aggregate([
      {
        $project: {
          date: '$createdAt',
          month: {
            $month: '$createdAt',
          },
          year: {
            $year: '$createdAt',
          },
        },
      },
      {
        $match: {
          month: month,
          year: year,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m',
              date: '$date',
            },
          },
          newUser: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    var totalTicket = 0;
    var totalSale = 0;
    var totalNewUser = 0;
    var totalCanceledTicket = 0;

    if (result.length != 0) {
      totalTicket = result[0].totalTicket;
      totalSale = result[0].totalSale;
    }
    if (canceledTicket.length != 0) {
      totalCanceledTicket = canceledTicket[0].totalCanceledTicket;
    }
    if (newUser.length != 0) {
      totalNewUser = newUser[0].newUser;
    }

    res.status(200).json({ totalTicket, totalSale, totalNewUser, totalCanceledTicket });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.getDateByMonthYear = async (req, res) => {
  try {
    const { month, year } = req.body;

    const result = await Seat.aggregate([
      {
        $lookup: {
          from: 'wagontickets',
          localField: 'idWagonTicket',
          foreignField: '_id',
          as: 'result',
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              {
                $arrayElemAt: ['$result', 0],
              },
              '$$ROOT',
            ],
          },
        },
      },
      {
        $project: {
          result: 0,
        },
      },
      {
        $lookup: {
          from: 'custickets',
          localField: '_id',
          foreignField: 'idSeat',
          as: 'result',
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              {
                $arrayElemAt: ['$result', 0],
              },
              '$$ROOT',
            ],
          },
        },
      },
      {
        $project: {
          result: 0,
        },
      },
      {
        $match: {
          isCancel: false,
        },
      },
      {
        $project: {
          date: '$createdAt',
          month: {
            $month: '$createdAt',
          },
          year: {
            $year: '$createdAt',
          },
          price: '$price',
        },
      },
      {
        $match: {
          month: month,
          year: year,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$date',
            },
          },
          totalTicket: {
            $sum: 1,
          },
          totalSale: {
            $sum: '$price',
          },
        },
      },
    ]);
    let listTicket = [];
    let listSale = [];
    var day = new Date(year, month, 0).getDate();

    if (result.length == day) {
      for (var ii = 0; ii < result.length; ii++) {
        listTicket.push(result[ii].totalTicket);
        listSale.push(result[ii].totalSale);
      }
    } else {
      for (var i = 1, j = 0; i <= day; i++) {
        if (j == result.length) {
          listTicket.push(0);
          listSale.push(0);
        } else if (
          result[j]._id ==
          (i < 10
            ? month < 10
              ? `${year}-0${month}-0${i}`
              : `${year}-${month}-0${i}`
            : month < 10
            ? `${year}-0${month}-${i}`
            : `${year}-${month}-${i}`)
        ) {
          listTicket.push(result[j].totalTicket);
          listSale.push(result[j].totalSale);
          j++;
        } else {
          listTicket.push(0);
          listSale.push(0);
        }
      }
    }
    res.status(200).json({ listTicket, listSale });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.getReportEnterprises = async (req, res) => {
  try {
    const { month, year } = req.body;

    const result = await Seat.aggregate([
      {
        $lookup: {
          from: 'wagontickets',
          localField: 'idWagonTicket',
          foreignField: '_id',
          as: 'result',
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              {
                $arrayElemAt: ['$result', 0],
              },
              '$$ROOT',
            ],
          },
        },
      },
      {
        $project: {
          result: 0,
        },
      },
      {
        $lookup: {
          from: 'tickets',
          localField: 'idTicket',
          foreignField: '_id',
          as: 'result',
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              {
                $arrayElemAt: ['$result', 0],
              },
              '$$ROOT',
            ],
          },
        },
      },
      {
        $project: {
          result: 0,
        },
      },
      {
        $lookup: {
          from: 'trips',
          localField: 'idTrip',
          foreignField: '_id',
          as: 'result',
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              {
                $arrayElemAt: ['$result', 0],
              },
              '$$ROOT',
            ],
          },
        },
      },
      {
        $project: {
          result: 0,
        },
      },
      {
        $lookup: {
          from: 'routes',
          localField: 'idRoute',
          foreignField: '_id',
          as: 'result',
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              {
                $arrayElemAt: ['$result', 0],
              },
              '$$ROOT',
            ],
          },
        },
      },
      {
        $project: {
          result: 0,
        },
      },
      {
        $lookup: {
          from: 'enterprises',
          localField: 'idEnterprise',
          foreignField: '_id',
          as: 'result',
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              {
                $arrayElemAt: ['$result', 0],
              },
              '$$ROOT',
            ],
          },
        },
      },
      {
        $project: {
          result: 0,
        },
      },
      {
        $lookup: {
          from: 'custickets',
          localField: '_id',
          foreignField: 'idSeat',
          as: 'result',
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              {
                $arrayElemAt: ['$result', 0],
              },
              '$$ROOT',
            ],
          },
        },
      },
      {
        $project: {
          result: 0,
        },
      },
      {
        $match: {
          isCancel: false,
        },
      },
      {
        $project: {
          name: '$name',
          date: '$createdAt',
          month: {
            $month: '$createdAt',
          },
          year: {
            $year: '$createdAt',
          },
          price: '$price',
        },
      },
      {
        $match: {
          month: month,
          year: year,
        },
      },
      {
        $group: {
          _id: '$name',
          totalTicket: {
            $sum: 1,
          },
          totalSale: {
            $sum: '$price',
          },
        },
      },
    ]);

    let report = [];

    for (let r of result) {
      report.push(r);
    }

    res.status(200).json(report);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
