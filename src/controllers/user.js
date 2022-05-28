const User = require("../models/user");
const Profile = require("../models/profile");

exports.getAll = async (req, res) => {
  try {
    var users = await User.find();
    let listCustomer = [];
    let listAdmin = [];
    let listSteersman = [];

    for (var i = 0; i < users.length; i++) {
      let us = JSON.parse(JSON.stringify(users[i]));
      let profile = await Profile.find({ account: us._id });
      us.profile = profile;
      if (us.role === "user") {
        listCustomer.push(us);
      } else if (us.role === "admin") {
        listAdmin.push(us);
      } else if (us.role === "steersman") {
        listSteersman.push(us);
      }
    }
    res.status(200).json({
      listCustomer: listCustomer,
      listAdmin: listAdmin,
      listSteersman: listSteersman,
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.getById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const profile = await Profile.findOne({ account: user._id });
    let res_user = JSON.parse(JSON.stringify(user));
    res_user.profile = profile;
    res.status(200).json(res_user);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// exports.create = async (req, res) => {
//   const newUser = new User(req.body);

//   try {
//     const saved = await newUser.save();
//     res.status(200).json(saved);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// };

// exports.update = async (req, res) => {
//   try {
//     const updated = await Vehicle.findByIdAndUpdate(
//       req.params.id,
//       {
//         $set: req.body,
//       },
//       { new: true }
//     );
//     res.status(200).json(updated);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// };

// exports.deleteById = async (req, res) => {
//   try {
//     await Vehicle.findByIdAndDelete(req.params.id);
//     res.status(200).json("Has been deleted");
//   } catch (err) {
//     res.status(500).json(err);
//   }
// };
