// const { Steersman } = require('../models');
const Vehicle = require('../models/vehicle');

exports.getAll = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.status(200).json(vehicles);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.getById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    res.status(200).json(vehicle);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.create = async (req, res) => {
  try {
    const { idEnterprise, idTrain, numPlate, typeOfSpeed } = req.body;

    if (idTrain === 'SE01') {
      const newVehicle = new Vehicle({
        idEnterprise,
        idTrain,
        numPlate,
        wagons: ['nmdh', 'nmdh', 'nk6dh', 'nk6dh', 'nk4dh', 'nk4dh', 'nk4dh', 'nk4dh', 'nk6dh'],
        typeOfSpeed,
      });
      const saved = await newVehicle.save();
      res.status(200).json(saved);
    } else if (idTrain === 'SE02') {
      const newVehicle = new Vehicle({
        idEnterprise,
        idTrain,
        numPlate,
        wagons: ['nmdh', 'nmdh', 'nk6dh', 'nk6dh', 'nk4dh', 'nk4dh', 'nk4dh', 'nk4dh', 'nk6dh'],
        typeOfSpeed,
      });
      const saved = await newVehicle.save();
      res.status(200).json(saved);
    } else if (idTrain === 'SE03') {
      const newVehicle = new Vehicle({
        idEnterprise,
        idTrain,
        numPlate,
        wagons: [
          'nmdh',
          'nmdh',
          'nk6dh',
          'nk6dh',
          'nk6dh',
          'nk6dh',
          'nk4dh',
          'nk4dh',
          'nk4dh',
          'nk4dh',
        ],
        typeOfSpeed,
      });
      const saved = await newVehicle.save();
      res.status(200).json(saved);
    } else if (idTrain === 'SE04') {
      const newVehicle = new Vehicle({
        idEnterprise,
        idTrain,
        numPlate,
        wagons: ['nmdh', 'nmdh', 'nk6dh', 'nk6dh', 'nk6dh', 'nk4dh', 'nk4dh', 'nk4dh'],
        typeOfSpeed,
      });
      const saved = await newVehicle.save();
      res.status(200).json(saved);
    } else if (idTrain === 'SE05') {
      const newVehicle = new Vehicle({
        idEnterprise,
        idTrain,
        numPlate,
        wagons: ['nmdh', 'nmdh', 'nk6dh', 'nk6dh', 'nk4dh', 'nk4dh', 'nk4dh', 'nk4dh', 'nk4dh'],
        typeOfSpeed,
      });
      const saved = await newVehicle.save();
      res.status(200).json(saved);
    } else if (idTrain === 'SE06') {
      const newVehicle = new Vehicle({
        idEnterprise,
        idTrain,
        numPlate,
        wagons: ['nmdh', 'nmdh', 'nk6dh', 'nk6dh', 'nk4dh', 'nk4dh', 'nk4dh', 'nk4dh', 'nk6dh'],
        typeOfSpeed,
      });
      const saved = await newVehicle.save();
      res.status(200).json(saved);
    } else if (idTrain === 'SE07') {
      const newVehicle = new Vehicle({
        idEnterprise,
        idTrain,
        numPlate,
        wagons: ['nmdh', 'nmdh', 'nmdh', 'nmdh', 'nk6dh', 'nk6dh', 'nk6dh', 'nk4dh', 'nk4dh'],
        typeOfSpeed,
      });
      const saved = await newVehicle.save();
      res.status(200).json(saved);
    } else if (idTrain === 'SE08') {
      const newVehicle = new Vehicle({
        idEnterprise,
        idTrain,
        numPlate,
        wagons: ['nmdh', 'nmdh', 'nk6dh', 'nk6dh', 'nk6dh', 'nk4dh', 'nk4dh', 'nk4dh'],
        typeOfSpeed,
      });
      const saved = await newVehicle.save();
      res.status(200).json(saved);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await Vehicle.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    // console.log(updated);
    // if (updated.isActive === 'no') {
    //   const updated2 = await Steersman.updateMany(
    //     { idVehicle: updated._id },
    //     { $unset: { idVehicle: '' } },
    //     { new: true }
    //   );
    //   console.log(updated2);
    // }
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.deleteById = async (req, res) => {
  try {
    await Vehicle.findByIdAndDelete(req.params.id);
    res.status(200).json('Has been deleted');
  } catch (err) {
    res.status(500).json(err);
  }
};
