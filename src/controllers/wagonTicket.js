const WagonTicket = require("../models/wagonTicket");

exports.create = async (req, res) => {
    const newWagonTicket = new WagonTicket(req.body);

    try {
        const saved = await newWagonTicket.save();
        res.status(200).json(saved);
    } catch (err) {
        res.status(500).json(err);
    }
}