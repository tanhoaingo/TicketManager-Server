const mongoose = require('mongoose');

const CusTicketSchema = new mongoose.Schema(
  {
    idSeat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Seat',
      required: true,
    },
    idInvoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invoice',
      required: true,
    },
    cusName: {
      type: String,
      required: true,
    },
    cusID: {
      type: Number,
      required: true,
    },
    cusAge: {
      type: Number,
      required: true,
    },
    isCancel: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CusTicket', CusTicketSchema);
