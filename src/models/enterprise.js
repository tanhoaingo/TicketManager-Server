const mongoose = require('mongoose');

const EnterpriseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    hotline: {
      type: String,
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

module.exports = mongoose.model('Enterprise', EnterpriseSchema);
