const mongoose = require('mongoose');

const WagonTicketSchema = new mongoose.Schema(
  {
    idTicket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
      required: true,
    },
    numOfWagon: {
      type: Number,
      required: true,
    },
    wagon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wagons',
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('WagonTicket', WagonTicketSchema);
