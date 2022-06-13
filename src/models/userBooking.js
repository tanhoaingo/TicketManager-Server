const mongoose = require('mongoose');

const UserBookingSchema = new mongoose.Schema({
  idType: {
    type: String,
    required: true,
  },
  idInvoice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice',
    required: true,
  },
  type: {
    type: String,
    enum: ['user', 'guest', 'admin'],
    default: 'guest',
  },
  fullname: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  identifyNumber: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    default: '',
    required: false,
  },
});

module.exports = mongoose.model('UserBooking', UserBookingSchema);
