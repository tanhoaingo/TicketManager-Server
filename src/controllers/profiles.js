const Profile = require("../models/profile");
const User = require("../models/user.js");
const env = require("dotenv");
// const { model } = require("mongoose");

env.config();

exports.userProfile = async (req, res) => {
  try {
    let { username } = req.params;
    let user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // let profile = await Profile.findOne({ account: user._id });
    // return res.status(200).json({
    //     profile,
    //     success: true,
    //     //User: user.getUserInfo(),
    // });
    let profile = await Profile.findOne({ account: user._id }).populate(
      "account",
      "firstName lastName username email contactNumber fullName",
      User
    );
    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// exports.UpdateProfile = async (req, res) => {
//     try {
//         let { dob, gender } = req.body;
//         let path = process.env.APP_DOMAIN + (req.file.path).replace(/^.*[\\\/]/, '');
//         let profile = await Profile.findOneAndUpdate(
//             { account: req.user._id },
//             { dob, gender, avatar: path },
//             { new: true }
//         );
//         return res.status(200).json({
//             success: true,
//             message: "Your profile is now update",
//             profile,
//         })
//     } catch (error) {
//         console.log(error);
//         return res.status(400).json({
//             success: false,
//             message: "Unable to get profile",
//         });
//     }
// };

exports.UpdateProfile = async (req, res) => {
  try {
    // //let { dob, gender } = req.body;
    // //let path = process.env.APP_DOMAIN + (req.file.path).replace(/^.*[\\\/]/, '');
    // let profile = await Profile.findOneAndUpdate(
    //   { account: req.user._id },
    //   //{ dob, gender, avatar: path },
    //   { new: true }
    // );

    const user = await User.findById(req.user._id);
    if (user) {
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.email = req.body.email || user.email;
      user.contactNumber = req.body.contactNumber || user.contactNumber;
    }
    // const updateUser = await user.save();

    const upProfile = await Profile.findOne({ account: user._id });
    if (upProfile) {
      upProfile.dob = req.body.dob || upProfile.dob;
      upProfile.gender = req.body.gender || upProfile.gender;
      //if (req.file) upProfile.avatar = process.env.APP_DOMAIN + (req.file.path).replace(/^.*[\\\/]/, '') || upProfile.avatar;
      upProfile.avatar = req.body.avatar || upProfile.avatar;
      //console.log(req.file)
    }
    // const updateProfile = await upProfile.save();

    let profile = await Profile.findOne({ account: user._id }).populate(
      "account",
      "firstName lastName username email contactNumber fullName",
      User
    );

    return res.status(200).json({
      success: true,
      message: "Your profile is now update",
      profile,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Unable to get profile",
    });
  }
};

exports.myProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({ account: req.user._id }).populate(
      "account",
      "firstName lastName username email contactNumber fullName",
      User
    );
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Your profile is not available",
      });
    }
    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Unable to get profile",
    });
  }
};

exports.profiles = async (req, res) => {
  try {
    let { dob, gender, avatar } = req.body;
    //let path = ""
    //let path = process.env.APP_DOMAIN + (req.file.path).split("uploads/")[1];
    //if (req.file) path = process.env.APP_DOMAIN + (req.file.path).replace(/^.*[\\\/]/, '');
    //if (req.file) path = process.env.APP_DOMAIN + `${req.file.filename}`
    //console.log("path: ", path)
    let _profile = new Profile({
      account: req.user._id,
      avatar,
      dob,
      gender,
    });
    //console.log("USER_PROFILE", _profile);
    _profile.save((error, data) => {
      if (error) {
        console.log(error);
        return res.status(400).json({
          message: "Something went wrong",
        });
      }
      if (data) {
        return res.status(201).json({
          message: "Profile create successfully",
        });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Unable to create your profile",
    });
  }
};
