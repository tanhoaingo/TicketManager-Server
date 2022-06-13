const UserBooking = require('../models/userBooking');
const nodemailer = require('nodemailer');
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
  const newUserBooking = new UserBooking(data);

  try {
    const code = `VN${data.identifyNumber.slice(0, 3)}${newUserBooking._id.toString().slice(0, 3)}`;

    newUserBooking.code = code;

    const saved = await newUserBooking.save();
    await nodemailer.createTestAccount();
    if (saved) {
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        secure: true, // true for 465, false for other ports
        auth: {
          user: '5tingteamuit@gmail.com', // generated ethereal user
          pass: 'kteoybiuwrzmicuf', // generated ethereal password
        },
      });
      await transporter.sendMail({
        from: '5Ting Train <5tingteamuit@gmail.com>', // sender address
        to: `${saved.email}`, // list of receivers
        subject: 'Vé của bạn đã được đặt thành công', // Subject line
        text: 'Hello world?', // plain text body
        html: `<p>Chào bạn<strong> ${saved.fullname},</strong></p> <p>Mã đơn hàng: <strong>${
          saved.code
        }</strong> </p> <p>Số điện thoại: <strong>${saved.phoneNumber}</strong> </p> 
        <p>Nơi đi: <strong>${req.body.startLocation}</strong> </p> <p>Nơi đến: <strong>${
          req.body.endLocation
        }</strong> </p> <p>Ngày đi: <strong>${new Date(req.body.date).toLocaleDateString(
          'vi-VN'
        )}</strong> </p>`, // html body
      });

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
