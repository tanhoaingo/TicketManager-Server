const Steersman = require('../models/steersman');
const user = require('../models/user');
const bcrypt = require('bcrypt');
const profile = require('../models/profile');

exports.getAll = async (req, res) => {
  try {
    const steersman = await Steersman.find().populate('idUser');
    res.status(200).json(steersman);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.getById = async (req, res) => {
  try {
    const steersman = await Steersman.findById(req.params.id);
    res.status(200).json(steersman);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.create = async (req, res) => {
  const { firstName, lastName, email, password, username, contactNumber, role } = req.body;
  const hash_password = await bcrypt.hash(password, 10);
  try {
    const _user = new user({
      firstName,
      lastName,
      email,
      hash_password,
      username,
      contactNumber,
      role,
    });
    _user.save();

    console.log('user', _user);

    let { dob, gender, avatar } = req.body;
    let _profile = new profile({
      account: _user._id,
      avatar,
      dob,
      gender,
    });
    _profile.save();

    const { idEnterprise } = req.body;
    const newSteersman = new Steersman({
      idUser: _user._id,
      idEnterprise,
    });

    const saved = await newSteersman.save();
    res.status(200).json({ saved, _user, _profile, message: 'Create successfully' });
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await Steersman.findByIdAndUpdate(
      req.params.id,
      {
        idEnterprise: req.body.idEnterprise,
        isActive: req.body.isActive,
      },
      { new: true }
    );
    const updated2 = await user.findByIdAndUpdate(
      req.body.idUser,
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        contactNumber: req.body.contactNumber,
      },
      { new: true }
    );
    const update3 = await profile.findOneAndUpdate(
      { account: updated2._id },
      { gender: req.body.gender },
      { new: true }
    );
    res.status(200).json(updated, updated2, update3);
  } catch (err) {
    res.status(500).json(err);
    console.log('xxx', err);
  }
};

exports.deleteById = async (req, res) => {
  try {
    await Steersman.findByIdAndDelete(req.params.id);
    res.status(200).json('Has been deleted');
  } catch (err) {
    res.status(500).json(err);
  }
};
