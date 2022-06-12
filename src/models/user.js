const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      max: 20,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      max: 20,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      index: true,
      lowercase: true,
      min: 3,
      max: 20,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    hash_password: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "steersman"],
      default: "user",
    },
    profilePicture: { type: String },
  },
  { timestamps: true }
);

// userSchema.virtual("password").set(function (password) {
//   this.hash_password = bcrypt.hashSync(password, 10);
// });

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.methods = {
  authenticate: function (password) {
    let rel;
    bcrypt.compare(password, this.hash_password, function () {
      //console.log(result);
      rel = true;
    });
    return rel;
  },
};

// userSchema.method.getUserInfo = function () {
//   return pick(this, ["_id", "username", "email", "firstName", "lastName"]);
// };

module.exports = mongoose.model("User", userSchema);
