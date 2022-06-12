const UserBooking = require('../models/userBooking');

exports.create = async (req, res) => {
  const data = {
    idType: req.body.idType,
    type: req.body.type,
    idInvoice: req.body.idInvoice,
    fullname: req.body.fullname,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    identifyNumber: req.body.identifyNumber,
  };

  try {
    const newUserBooking = new UserBooking(data);

    const code = `VN${data.identifyNumber.slice(0, 3)}${newUserBooking._id.slice(0, 3)}`;

    newUserBooking.code = code;

    const saved = await newUserBooking.save();

    if (saved) {
      return res.status(200).json({
        status: 'success',
        message: 'create userBooking successfully',
        userBooking: newUserBooking,
      });
    } else {
      return res.status(401).json({
        status: false,
        message: 'missing value',
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'error in server',
      req: req.body,
    });
  }
};
