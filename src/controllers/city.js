const City = require("../models/city");
// const Location = require("../models/location");

exports.getAll = async (req, res) => {
  try {
    const cities = await City.find();
    let listCities = [];
    for (var i = 0; i < cities.length; i++) {
      let ci = JSON.parse(JSON.stringify(cities[i]));
      // let location = await Location.find({ idCity: ci._id });
      // ci.location = location;
      listCities.push(ci);
    }
    res.status(200).json(listCities);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.getById = async (req, res) => {
  try {
    const city = await City.findById(req.params.id);
    res.status(200).json(city);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.create = async (req, res) => {
  const newCity = new City(req.body);

  try {
    const saved = await newCity.save();
    res.status(200).json(saved);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await City.findByIdAndUpdate(
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
    await City.findByIdAndDelete(req.params.id);
    res.status(200).json("Has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
};
