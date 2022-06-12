const Wagon = require("../models/wagons");

exports.create = async (req, res) => {
    const newWagon = new Wagon(req.body);

    try {
        const saved = await newWagon.save();
        res.status(200).json(saved);
    } catch (err) {
        res.status(500).json(err);
    }
};