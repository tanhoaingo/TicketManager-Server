const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema(
  {
    idVehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true,
    },
    idRoute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route',
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: String,
      default: 'yes',
    },
    idSteersman: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Steersman',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Trip', TripSchema);
