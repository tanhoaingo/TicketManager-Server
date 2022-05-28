const mongoose = require("mongoose");

const RouteSchema = new mongoose.Schema(
  {
    idEnterprise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enterprise",
      required: true,
    },
    startLocation: {
      type: String,
      required: true,
    },
    endLocation: {
      type: String,
      required: true,
    },
    startTime: {
      type: Number,
      required: true,
    },
    totalTime: {
      type: Number,
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

module.exports = mongoose.model("Route", RouteSchema);
