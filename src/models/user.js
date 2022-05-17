const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      min: 1,
      max: 20,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      min: 1,
      max: 20,
    },
    hash_password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      min: 5,
      max: 15,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'steersman'],
      default: 'user',
    },
    avatar: { type: String },
  },
  { timestamps: true }
);

userSchema.virtual('password').set(function (password) {
  this.hash_password = bcrypt.hashSync(password, 10);
});

userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.methods = {
  authenticate: async function (password) {
    let result = false;

    await bcrypt.compare(password, this.hash_password, function (err, same) {
      result = same;
    });

    return result;
  },
};

module.exports = mongoose.model('User', userSchema);
