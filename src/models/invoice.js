const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema(
  {
    idTicket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
      required: true,
    },
    payment: {
      type: String,
      required: true,
    },
    isPay: {
      type: Boolean,
      require: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Invoice', InvoiceSchema);
