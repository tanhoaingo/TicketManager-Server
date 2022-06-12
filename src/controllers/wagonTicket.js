const WagonTicket = require('../models/wagonTicket');
const Wagon = require('../models/wagons');
const Trip = require('../models/trip.js');
const Ticket = require('../models/ticket.js');
const Seat = require('../models/seat.js');

const user = require('../models/user');
const Vehicle = require('../models/vehicle');
const cusTicket = require('../models/cusTicket');
const Enterprise = require('../models/enterprise');
const Rule = require('../models/rule');

exports.create = async (req, res) => {
  const newWagonTicket = new WagonTicket(req.body);

  try {
    const saved = await newWagonTicket.save();
    res.status(200).json(saved);
  } catch (err) {
    res.status(500).json(err);
  }
};

const PriceOfWagonTicket = (rule, typeOfWagon, price) => {
  if (typeOfWagon === 'nmdh') return price * rule.coefficientNMDH;
  if (typeOfWagon === 'nk4dh') return price * rule.coefficientNK4DH;
  if (typeOfWagon === 'nk6dh') return price * rule.coefficientNK6DH;
};

exports.createAllWagons = async (req, res) => {
  try {
    let payload = [];
    const { idTrip } = req.body;
    const trip = await Trip.findOne({ _id: idTrip });
    const ticket = await Ticket.findOne({ idTrip: idTrip });
    const vehicle = await Vehicle.findOne({ _id: trip.idVehicle });
    const wagons = await Wagon.find();
    const rule = await Rule.findOne();

    for (let i in vehicle.wagons) {
      for (let w of wagons) {
        if (w.idWagon == vehicle.wagons[i]) {
          const newWagonTicket = new WagonTicket({
            idTicket: ticket._id,
            numOfWagon: i,
            wagon: w._id,
            price: PriceOfWagonTicket(rule, w.idWagon, req.body.price),
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
    const wagonTicket = await WagonTicket.find().populate('idTicket');
    res.status(200).json(wagonTicket);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.getAllByIdTrip = async (req, res) => {
  try {
    let payload = [];

    const wagonTickets = await WagonTicket.find();

    const { idTrip, startIndex, endIndex } = req.body;

    const wagon = await Wagon.find();

    const trip = await Trip.findOne({ _id: idTrip });

    const ticket = await Ticket.findOne({ idTrip: trip._id });

    const seats = await Seat.find();
    const vehicals = await Vehicle.find();

    const cusTickets = await cusTicket.find();

    if (ticket) {
      const filteredWagonTickets = wagonTickets.filter(wagonTickets => {
        return wagonTickets.idTicket.equals(ticket._id);
      });

      filteredWagonTickets.map(wagonTicket => {
        const filteredSeats = seats.filter(seat => {
          for (let c of cusTickets) {
            if (endIndex - startIndex > 0) {
              if (c.idSeat.equals(seat._id)) {
                let isValid = true;
                if (seat.startIndex < startIndex) {
                  isValid =
                    isValid &&
                    seat.idWagonTicket.equals(wagonTicket._id) &&
                    !c.isCancel &&
                    seat.endIndex > startIndex;
                  return isValid;
                } else if (seat.startIndex > startIndex) {
                  isValid =
                    isValid &&
                    seat.idWagonTicket.equals(wagonTicket._id) &&
                    !c.isCancel &&
                    seat.startIndex < endIndex;
                  return isValid;
                }
              }
            } else if (endIndex - startIndex < 0) {
              if (c.idSeat.equals(seat._id)) {
                let isValid = true;
                if (seat.startIndex > startIndex) {
                  isValid =
                    isValid &&
                    seat.idWagonTicket.equals(wagonTicket._id) &&
                    !c.isCancel &&
                    seat.endIndex < startIndex;
                  return isValid;
                } else if (seat.startIndex < startIndex) {
                  isValid =
                    isValid &&
                    seat.idWagonTicket.equals(wagonTicket._id) &&
                    !c.isCancel &&
                    seat.startIndex > endIndex;
                  return isValid;
                }
              }
            }
          }
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

exports.update = async (req, res) => {
  try {
    const { idTrip, fixed_price } = req.body;
    const ticket = await Ticket.findOne({ idTrip: idTrip });
    const wagonTickets = await WagonTicket.find();
    const wagons = await Wagon.find();
    const rule = await Rule.findOne();

    let result = [];

    for (let w of wagonTickets) {
      if (w.idTicket.equals(ticket._id)) {
        for (let wagon of wagons) {
          if (wagon._id.equals(w.wagon)) {
            if (wagon.idWagon === 'nmdh') {
              const updated = await WagonTicket.findByIdAndUpdate(
                w._id,
                {
                  price: fixed_price * rule.coefficientNMDH,
                },
                { new: true }
              );
              result = result.concat(updated);
            } else if (wagon.idWagon === 'nk4dh') {
              const updated = await WagonTicket.findByIdAndUpdate(
                w._id,
                {
                  price: fixed_price * rule.coefficientNK4DH,
                },
                { new: true }
              );
              result = result.concat(updated);
            } else if (wagon.idWagon === 'nk6dh') {
              const updated = await WagonTicket.findByIdAndUpdate(
                w._id,
                {
                  price: fixed_price * rule.coefficientNK6DH,
                },
                { new: true }
              );
              result = result.concat(updated);
            }
          }
        }
      }
    }
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
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
          price: '$cusPriceTicket',
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
          price: '$cusPriceTicket',
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
          price: '$cusPriceTicket',
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

exports.getCurrentByEnterprisesList = async (req, res) => {
  try {
    const bookingByEnterprises = await cusTicket.aggregate([
      {
        $lookup: {
          from: 'seats',
          localField: 'idSeat',
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
        $match: {
          createdAt: {
            $gte: new Date(new Date().setUTCHours(0, 0, 0, 0)),
            $lt: new Date(new Date().setUTCHours(23, 59, 59, 999)),
          },
          isCancel: false,
          isDeleted: 'no',
        },
      },
      {
        $group: {
          _id: '$name',
          totalBooking: {
            $sum: 1,
          },
          totalSale: {
            $sum: '$cusPriceTicket',
          },
        },
      },
      {
        $sort: {
          totalSale: -1,
        },
      },
    ]);

    let data = [];

    if (bookingByEnterprises.length == 0) {
      const enterpriseList = await Enterprise.aggregate([
        {
          $match: {
            isDeleted: 'no',
          },
        },
      ]);

      for (let i = 0; i < enterpriseList.length; i++) {
        data.push({
          username: enterpriseList[i].name,
          order: '0',
          price: '0',
        });
      }
    } else {
      const enterpriseList = await Enterprise.aggregate([
        {
          $match: {
            isDeleted: 'no',
          },
        },
      ]);
      var temp = false;

      for (let i = 0; i < enterpriseList.length; i++) {
        for (let j = 0; j < bookingByEnterprises.length; j++) {
          if (enterpriseList[i].name == bookingByEnterprises[j]._id) {
            data.push({
              username: enterpriseList[i].name,
              order: bookingByEnterprises[j].totalBooking,
              price: bookingByEnterprises[j].totalSale,
            });
            temp = true;
          }
        }
        if (!temp) {
          data.push({
            username: enterpriseList[i].name,
            order: '0',
            price: '0',
          });
        } else {
          temp = false;
        }
      }
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.getCurrentByEnterprises = async (req, res) => {
  try {
    const bookingByEnterprises = await cusTicket.aggregate([
      {
        $lookup: {
          from: 'seats',
          localField: 'idSeat',
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
        $match: {
          createdAt: {
            $gte: new Date(new Date().setUTCHours(0, 0, 0, 0)),
            $lt: new Date(new Date().setUTCHours(23, 59, 59, 999)),
          },
          isCancel: false,
          isDeleted: 'no',
        },
      },
      {
        $group: {
          _id: '$name',
          totalBooking: {
            $sum: 1,
          },
          totalSale: {
            $sum: '$cusPriceTicket',
          },
        },
      },
      {
        $sort: {
          totalSale: -1,
        },
      },
    ]);

    let booking = [];
    let sale = [];

    if (bookingByEnterprises.length == 0) {
      const enterpriseList = await Enterprise.aggregate([
        {
          $match: {
            isDeleted: 'no',
          },
        },
      ]);
      for (let i = 0; i < enterpriseList.length; i++) {
        booking.push(0);
        sale.push(0);
      }
    } else {
      const enterpriseList = await Enterprise.aggregate([
        {
          $match: {
            isDeleted: 'no',
          },
        },
      ]);

      var temp = false;

      for (let i = 0; i < enterpriseList.length; i++) {
        for (let j = 0; j < bookingByEnterprises.length; j++) {
          if (enterpriseList[i].name == bookingByEnterprises[j]._id) {
            booking.push(bookingByEnterprises[j].totalBooking);
            sale.push(bookingByEnterprises[j].totalSale);
            temp = true;
          }
        }
        if (!temp) {
          booking.push(0);
          sale.push(0);
        } else {
          temp = false;
        }
      }
    }

    res.status(200).json({ booking, sale });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.getCurrentDate = async (req, res) => {
  try {
    const tripCD = await Trip.aggregate([
      {
        $match: {
          startDate: new Date(new Date().setUTCHours(0, 0, 0, 0)),
        },
      },
      {
        $group: {
          _id: '$startDate',
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    const ticketCD = await cusTicket.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setUTCHours(0, 0, 0, 0)),
            $lt: new Date(new Date().setUTCHours(23, 59, 59, 999)),
          },
          isCancel: false,
        },
      },
      {
        $project: {
          date: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt',
            },
          },
        },
      },
      {
        $group: {
          _id: '$date',
          count: {
            $sum: 1,
          },
        },
      },
    ]);
    const cancelTicketCD = await cusTicket.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setUTCHours(0, 0, 0, 0)),
            $lt: new Date(new Date().setUTCHours(23, 59, 59, 999)),
          },
          isCancel: true,
        },
      },
      {
        $project: {
          date: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt',
            },
          },
        },
      },
      {
        $group: {
          _id: '$date',
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    const salesCD = await cusTicket.aggregate([
      {
        $lookup: {
          from: 'seats',
          localField: 'idSeat',
          foreignField: '_id',
          as: 'detail',
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              {
                $arrayElemAt: ['$detail', 0],
              },
              '$$ROOT',
            ],
          },
        },
      },
      {
        $project: {
          detail: 0,
        },
      },
      {
        $lookup: {
          from: 'wagonTickets',
          localField: 'idWagonTicket',
          foreignField: '_id',
          as: 'detail',
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              {
                $arrayElemAt: ['$detail', 0],
              },
              '$$ROOT',
            ],
          },
        },
      },
      {
        $project: {
          detail: 0,
        },
      },
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setUTCHours(0, 0, 0, 0)),
            $lt: new Date(new Date().setUTCHours(23, 59, 59, 999)),
          },
          isCancel: false,
        },
      },
      {
        $project: {
          date: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt',
            },
          },
          price: '$cusPriceTicket',
        },
      },
      {
        $group: {
          _id: '$date',
          count: {
            $sum: '$price',
          },
        },
      },
    ]);
    const newUser = await user.aggregate([
      {
        $match: {
          role: 'user',
          createdAt: {
            $gte: new Date(new Date().setUTCHours(0, 0, 0, 0)),
            $lt: new Date(new Date().setUTCHours(23, 59, 59, 999)),
          },
        },
      },
      {
        $project: {
          date: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt',
            },
          },
        },
      },
      {
        $group: {
          _id: '$date',
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    let data = [
      {
        icon: 'bx bx-bus',
        count: tripCD.length == 0 ? '0' : tripCD[0].count.toString(),
        title: 'Số chuyến xe',
      },
      {
        icon: 'bx bx-dollar-circle',
        count: salesCD.length == 0 ? '0' : salesCD[0].count.toString(),
        title: 'Doanh thu',
      },
      {
        icon: 'bx bx-receipt',
        count: ticketCD.length == 0 ? '0' : ticketCD[0].count.toString(),
        title: 'Vé bán',
      },
      {
        icon: 'bx bx-receipt',
        count: cancelTicketCD.length == 0 ? '0' : cancelTicketCD[0].count.toString(),
        title: 'Vé hủy',
      },
      {
        icon: 'bx bx-receipt',
        count: newUser.length == 0 ? '0' : newUser[0].count.toString(),
        title: 'Người dùng mới',
      },
    ];

    res.status(200).json(data);
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
          price: '$cusPriceTicket',
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
