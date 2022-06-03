const User = require('../models/user');
const Profile = require('../models/profile');
const UserBooking = require('../models/userBooking');
const Invoice = require('../models/invoice');
const bcrypt = require('bcrypt');
const CusTicket = require('../models/cusTicket');
const Seat = require('../models/seat');
const Trip = require('../models/trip');
const Route = require('../models/route');
const City = require('../models/city');
const Ticket = require('../models/ticket');
const EnterPrise = require('../models/enterprise');
const Vehicle = require('../models/vehicle');
const WagonTicket = require('../models/wagonTicket');

exports.getAll = async (req, res) => {
  try {
    var users = await User.find();
    let listCustomer = [];
    let listAdmin = [];
    let listSteersman = [];

    for (var i = 0; i < users.length; i++) {
      let us = JSON.parse(JSON.stringify(users[i]));
      let profile = await Profile.find({ account: us._id });
      us.profile = profile;
      if (us.role === 'user') {
        listCustomer.push(us);
      } else if (us.role === 'admin') {
        listAdmin.push(us);
      } else if (us.role === 'steersman') {
        listSteersman.push(us);
      }
    }
    res.status(200).json({
      listCustomer: listCustomer,
      listAdmin: listAdmin,
      listSteersman: listSteersman,
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.getById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const profile = await Profile.findOne({ account: user._id });
    let res_user = JSON.parse(JSON.stringify(user));
    res_user.profile = profile;
    res.status(200).json(res_user);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// exports.create = async (req, res) => {
//   const newUser = new User(req.body);

//   try {
//     const saved = await newUser.save();
//     res.status(200).json(saved);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// };

// exports.update = async (req, res) => {
//   try {
//     const updated = await Vehicle.findByIdAndUpdate(
//       req.params.id,
//       {
//         $set: req.body,
//       },
//       { new: true }
//     );
//     res.status(200).json(updated);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// };

exports.fetchUserTicket = async (req, res) => {
  try {
    const { userID } = req.body;

    const userBooking = await UserBooking.find({ idType: userID });
    const invoices = await Invoice.find();
    const seats = await Seat.find();
    const cusTickets = await CusTicket.find();
    const tickets = await Ticket.find();
    const routes = await Route.find();
    const cities = await City.find();
    const enterprises = await EnterPrise.find();
    const trips = await Trip.find();
    const vehicles = await Vehicle.find();
    const wagonTickets = await WagonTicket.find();

    if (!userBooking || userBooking.length < 1) {
      return res.json({
        success: true,
        message: 'this user dont have booking',
        hadTrip: false,
      });
    } else {
      const resultTicketAvailable = [];
      const resultTicketUsed = [];
      const resultTicketCancel = [];
      userBooking.map(userbookingItem => {
        const userBookingInfo = {
          fullname: userbookingItem.fullname,
          phoneNumber: userbookingItem.phoneNumber,
          email: userbookingItem.email,
          identifyNumber: userbookingItem.identifyNumber,
        };

        for (let invoice of invoices) {
          if (userbookingItem.idInvoice.equals(invoice._id)) {
            for (let ticketItem of tickets) {
              if (invoice.idTicket.equals(ticketItem._id)) {
                for (let tripItem of trips) {
                  if (ticketItem.idTrip.equals(tripItem._id)) {
                    for (let routeItem of routes) {
                      if (tripItem.idRoute.equals(routeItem._id)) {
                        const resultRoute = {
                          start: '',
                          end: '',
                          timeStart: '',
                          timeEnd: '',
                          date: '',
                          trainID: '',
                          enterprise: '',
                        };

                        //enterprise
                        const enterPriseName = enterprises.filter(item =>
                          routeItem.idEnterprise.equals(item._id)
                        )[0].name;

                        resultRoute.enterprise = enterPriseName;

                        const vehicleIdTrain = vehicles.filter(item =>
                          tripItem.idVehicle.equals(item._id)
                        )[0].idTrain;
                        resultRoute.trainID = vehicleIdTrain;
                        resultRoute.date = tripItem.startDate;

                        const unitTime = routeItem.totalTime / cities.length;

                        // resultRoute.timeStart = routeItem.startTime + unitTime*

                        // [
                        //   {
                        //     cusName: "",
                        //     cusID: "",
                        //     cusAge: "",
                        //     numsOfSeat: "",
                        //     numsOfWagon: "",
                        //     price: "",
                        //     typeSeat: "", //available, used, cancel
                        //   };
                        const resultSeat = [];
                        for (let wagonTicketItem of wagonTickets) {
                          if (wagonTicketItem.idTicket.equals(ticketItem._id)) {
                            for (let seatItem of seats) {
                              if (seatItem.idWagonTicket.equals(wagonTicketItem._id)) {
                                // const filterCusTicket = cusTickets.filter(item => {
                                //   return (
                                //     item.idSeat.equals(seatItem._id) &&
                                //     item.idInvoice.equals(invoice)
                                //   );
                                // });
                                console.log('hong', seatItem);

                                for (let cusTicketItem of cusTickets) {
                                  if (
                                    cusTicketItem.idSeat.equals(seatItem._id) &&
                                    cusTicketItem.idInvoice.equals(invoice._id)
                                  ) {
                                    const itemSeat = {
                                      cusName: '',
                                      cusId: '',
                                      cusAge: '',
                                      numOfSeat: '',
                                      numOfWagon: '',
                                      price: '',
                                      typeSeat: '', //available, used, cancel
                                    };
                                    itemSeat.cusName = cusTicketItem.cusName;
                                    itemSeat.cusId = cusTicketItem.cusID;
                                    itemSeat.cusAge = cusTicketItem.cusAge;
                                    //check date
                                    const today = new Date();
                                    const isUsed = tripItem.startDate < today;
                                    itemSeat.typeSeat = isUsed
                                      ? 'used'
                                      : cusTicketItem.isCancel
                                      ? 'cancel'
                                      : 'available';
                                    itemSeat.numOfSeat = seatItem.numOfSeat;
                                    itemSeat.numOfWagon = wagonTicketItem.numOfWagon;
                                    itemSeat.price =
                                      wagonTicketItem.price *
                                      (seatItem.endIndex - seatItem.startIndex);

                                    resultSeat.push(itemSeat);

                                    const cityNameStart = cities.filter(
                                      item => item.indexCity === seatItem.startIndex
                                    )[0]?.name;
                                    const cityNameEnd = cities.filter(
                                      item => item.indexCity === seatItem.endIndex
                                    )[0]?.name;
                                    resultRoute.start = cityNameStart;
                                    resultRoute.end = cityNameEnd;
                                  }
                                }
                                resultRoute.timeStart =
                                  routeItem.startTime + unitTime * seatItem.startIndex;

                                resultRoute.timeEnd =
                                  resultRoute.timeStart +
                                  unitTime * (seatItem.endIndex - seatItem.startIndex);
                              }
                            }
                          }
                        }

                        const seatCancel = [],
                          seatUsed = [],
                          seatAvalable = [];
                        resultSeat.map(item => {
                          if (item.typeSeat === 'cancel') {
                            seatCancel.push(item);
                          } else if (item.typeSeat === 'used') {
                            seatUsed.push(item);
                          } else seatAvalable.push(item);
                        });
                        seatCancel.length > 0 &&
                          resultTicketCancel.push({
                            route: resultRoute,
                            seat: resultSeat,
                            userBooking: userBookingInfo,
                          });

                        seatAvalable.length > 0 &&
                          resultTicketAvailable.push({
                            route: resultRoute,
                            seat: seatAvalable,
                            userBooking: userBookingInfo,
                          });
                        seatUsed.length > 0 &&
                          resultTicketUsed.push({
                            route: resultRoute,
                            seat: seatUsed,
                            userBooking: userBookingInfo,
                          });
                      }
                    }
                  }
                }
              }
            }
          }
        }
      });

      return res.json({
        success: true,
        hadTrip: true,
        data: {
          ticketUseds: resultTicketUsed,
          ticketAvailables: resultTicketAvailable,
          ticketCancels: resultTicketCancel,
        },
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};

exports.update = async (req, res) => {
  try {
    const updateData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      contactNumber: req.body.contactNumber,
      email: req.body.email,
    };
    const updated = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (updated) {
      return res.status(200).json({
        success: true,
        user: updated,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: 'missing value',
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'server has problem',
    });
  }
};
exports.updatePassword = async (req, res) => {
  try {
    const data = {
      oldPassword: req.body.oldPassword,
      newPassWord: req.body.newPassword,
      id: req.body.id,
    };
    const user = await User.findById(data.id);
    const checkPassword = bcrypt.compareSync(data.oldPassword, user.hash_password);
    if (checkPassword) {
      const newHash_password = await bcrypt.hash(data.newPassWord, 10);
      const updated = await User.findByIdAndUpdate(
        data.id,
        {
          hash_password: newHash_password,
        },
        { new: true }
      );
      if (updated) {
        return res.json({
          success: true,
          user: updated,
        });
      } else {
        return res.status(401).json({
          success: false,
          message: 'something wrong',
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'fail password',
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 'false',
      message: 'sever has problem',
    });
  }
};

// exports.deleteById = async (req, res) => {
//   try {
//     await Vehicle.findByIdAndDelete(req.params.id);
//     res.status(200).json("Has been deleted");
//   } catch (err) {
//     res.status(500).json(err);
//   }
// };
