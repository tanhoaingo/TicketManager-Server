const {
  // Enterprise,
  // Vehicle,
  Route,
  // Steersman,
  // Profile,
  Trip,
} = require('../models/index');

exports.getAll = async (req, res) => {
  try {
    const routes = await Route.find();
    res.status(200).json(routes);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.getById = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    res.status(200).json(route);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.create = async (req, res) => {
  const newRoute = new Route(req.body);
  try {
    const saved = await newRoute.save();
    res.status(200).json(saved);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await Route.findByIdAndUpdate(
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
};

exports.deleteById = async (req, res) => {
  try {
    await Route.findByIdAndDelete(req.params.id);
    res.status(200).json('Has been deleted');
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getInforbyID = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id).populate('idEnterprise');
    const trip = await Trip.find({ idRoute: route._id })
      .populate('idVehicle')
      .populate('idSteersman')
      .exec();
    res.status(200).json({
      route: route,
      trips: trip,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};
