const mongoose = require("mongoose");

const VehicleSchema = new mongoose.Schema(
  {
    idEnterprise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enterprise",
      required: true,
    },
    lisensePlate: {
      type: String,
      required: true,
    },
    totalSeat: {
      type: Number,
      required: true,
    },
    quality: {
      type: String,
      required: true,
    },
    isActive: {
      type: String,
      default: "yes",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Vehicle", VehicleSchema);
