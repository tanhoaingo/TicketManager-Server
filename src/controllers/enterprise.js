const { Enterprise, Route, Vehicle } = require('../models');
const Profile = require('../models/profile');
const steersman = require('../models/steersman');

const EnterpriseController = {
  getAllName: async (req, res) => {
    try {
      const enterpriseList = await Enterprise.find();

      var data = [];

      for (let i = 0; i < enterpriseList.length; i++) {
        data.push(enterpriseList[i].name);
      }

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  },

  getAll: async (req, res) => {
    try {
      const enterprises = await Enterprise.find();

      res.status(200).json(enterprises);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  },

  create: async (req, res) => {
    const newEnterprise = new Enterprise(req.body);

    try {
      const saved = await newEnterprise.save();

      res.status(200).json(saved);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  update: async (req, res) => {
    try {
      const updated = await Enterprise.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updated);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  getInforbyID: async (req, res) => {
    try {
      const enterprise = await Enterprise.findById(req.params.id);
      const routes = await Route.find({ idEnterprise: enterprise._id }).exec();
      const vehicles = await Vehicle.find({
        idEnterprise: enterprise._id,
      }).exec();
      const steersmans = await steersman
        .find({
          idEnterprise: enterprise._id,
        })
        .populate('idUser');
      let listSteersman = [];
      // var users = await user.find();
      for (var i = 0; i < steersmans.length; i++) {
        let ste = JSON.parse(JSON.stringify(steersmans[i]));
        let profile = await Profile.findOne({ account: ste.idUser._id });
        ste.profile = profile;
        listSteersman.push(ste);
      }
      res.status(200).json({
        enterprise: enterprise,
        routes: routes,
        vehicles: vehicles,
        steersmans: listSteersman,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: err });
    }
  },
};

module.exports = EnterpriseController;
