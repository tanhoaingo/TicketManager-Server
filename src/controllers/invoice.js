const cusTicket = require('../models/cusTicket.js');
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

exports.getAll = async (req, res) => {
  try {
    const result = await Invoice.aggregate([
      {
        $lookup: {
          from: 'userbookings',
          localField: '_id',
          foreignField: 'idInvoice',
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
    ]);

    const userbook = await cusTicket.aggregate([
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
        $match: {
          isCancel: false,
        },
      },
      {
        $group: {
          _id: '$idInvoice',
          totalPrice: {
            $sum: '$price',
          },
          totalTicket: {
            $sum: 1,
          },
        },
      },
    ]);

    let payload = [];
    let c = 1;

    if (result.length > 0) {
      for (let r of result) {
        let temp = {};
        for (let u of userbook) {
          if (r.idInvoice.equals(u._id)) {
            temp.totalPrice = u.totalPrice;
            temp.totalTicket = u.totalTicket;
          }
        }
        temp.stt = c.toString();
        temp.fullname = r.fullname;
        temp.email = r.email;
        temp.phoneNumber = r.phoneNumber.toString();
        temp.identifyNumber = r.identifyNumber;
        temp.payment = r.payment;
        if (r.isPay) temp.isPay = 'Đã thanh toán';
        else temp.isPay = 'Chưa thanh toán';
        payload.push(temp);
        c++;
      }
    }

    res.status(200).json(payload);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
