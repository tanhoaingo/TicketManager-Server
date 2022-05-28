// const { PersonSchema } = require("./person.js");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SteersmanSchema = new mongoose.Schema(
  {
    idUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    idProfile: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
    },
    position: {
      type: String,
      required: true,
    },
    idEnterprise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enterprise",
      required: true,
    },
    isActive: {
      type: String,
      default: "yes",
    },
    idVehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Steersman", SteersmanSchema);
