const mongoose = require("mongoose");

const DriveSchema = new mongoose.Schema(
    {
        idSteersman: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Steersman',
            required: true
        },
        idTrip: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Trip',
            required: true
        },
        Position: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Drive", DriveSchema);