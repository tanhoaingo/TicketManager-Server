const mongoose = require("mongoose");

const SeatSchema = new mongoose.Schema({
    idWagonTicket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WagonTicket',
        required: true
    },
    numOfSeat: {
        type: Number,
        required: true
    },
    startIndex: {
        type: Number,
        required: true
    },
    endIndex: {
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Seat", SeatSchema);