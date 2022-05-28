const mongoose = require("mongoose");

const WagonsSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            required: true
        },
        idWagon: {
            type: String,
            required: true
        },
        totalSeat: {
            type: Number,
            required: true,
            default: 64
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Wagons", WagonsSchema);