// const { PersonSchema } = require("./person.js");
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SteersmanSchema = new mongoose.Schema(
  {
    idUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    idEnterprise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Enterprise',
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

module.exports = mongoose.model('Steersman', SteersmanSchema);
