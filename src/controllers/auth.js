const User = require('../models/user.js');
const Profile = require('../models/profile');
const jwt = require('jsonwebtoken');
// const { validationResult } = require("express-validator");
const bcrypt = require('bcrypt');

exports.getNewUser = async (req, res) => {
  try {
    const { month, year } = req.body;

    const newUser = await User.aggregate([
      {
        $project: {
          date: '$createdAt',
          month: {
            $month: '$createdAt',
          },
          year: {
            $year: '$createdAt',
          },
        },
      },
      {
        $match: {
          month: month,
          year: year,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$date',
            },
          },
          newUser: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    let listUser = [];
    var day = new Date(year, month, 0).getDate();

    if (newUser.length == day) {
      for (var ii = 0; ii < newUser.length; ii++) {
        listUser.push(newUser[ii].newUser);
      }
    } else {
      for (var i = 1, j = 0; i <= day; i++) {
        if (j == newUser.length) {
          listUser.push(0);
        } else if (
          newUser[j]._id ==
          (i < 10
            ? month < 10
              ? `${year}-0${month}-0${i}`
              : `${year}-${month}-0${i}`
            : month < 10
            ? `${year}-0${month}-${i}`
            : `${year}-${month}-${i}`)
        ) {
          listUser.push(newUser[j].newUser);
          j++;
        } else {
          listUser.push(0);
        }
      }
    }

    res.status(200).json(listUser);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.signup = async (req, res) => {
  User.findOne({ email: req.body.email }).exec((error, user) => {
    if (user)
      return res.status(400).json({
        message: 'Email already registered',
      });
  });
  // User.findOne({ username: req.body.username }).exec((error, user) => {
  //   if (user)
  //     return res.status(400).json({
  //       message: "Username already registered",
  //     });
  // });


  const { firstName, lastName, email, password, username, contactNumber, role } = req.body;

  const hash_password = await bcrypt.hash(password, 10);
  const _user = new User({
    firstName,
    lastName,
    email,
    hash_password,
    username,
    contactNumber,
    role,
  });

  const token = jwt.sign({ _id: _user.id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
  _user.save((error, data) => {
    if (error) {
      return res.status(400).json({
        message: error,
      });
    }
    if (data) {
      return res.status(201).json({
        message: 'Create successfully',

        user: _user,
        token,

      });
    }
  });

  let { dob, gender, avatar } = req.body;
  let _profile = new Profile({
    account: _user._id,
    avatar,
    dob,
    gender,
  });
  //console.log("USER_PROFILE", _profile);
  _profile.save((error, data) => {
    if (error) {
      console.log(error);
    }
    if (data) {
      //console.log(data);
    }
  });
};

exports.signin = (req, res) => {
  User.findOne({ email: req.body.email }).exec((error, user) => {
    if (error) return res.status(400).json({ error });
    if (user) {
      const checkAuthen = bcrypt.compareSync(req.body.password, user.hash_password);
      if (checkAuthen) {
        const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET, {
          expiresIn: '1h',
        });
        const { _id, firstName, lastName, email, role, fullName, contactNumber } = user;
        res.status(200).json({
          token,
          user: {
            _id,
            firstName,
            lastName,
            email,
            role,
            fullName,
            contactNumber,
          },
          message: 'Login successfully <3',
        });
      } else {
        return res.status(400).json({
          message: 'Invalid password',
        });
      }
    } else {
      return res.status(400).json({ message: 'Something went wrong' });
    }
  });
};
