const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema(
  {
    idEnterprise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Enterprise',
      required: true,
    },
    idTrain: {
      type: String,
      required: true,
    },
    numPlate: {
      type: String,
      required: true,
    },
    wagons: {
      type: Array,
      required: true,
    },
    typeOfSpeed: {
      type: String,
      required: true,
    },
    isActive: {
      type: String,
      default: 'yes',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Vehicle', VehicleSchema);
