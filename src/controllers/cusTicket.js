const CusTicket = require("../models/cusTicket");

exports.create = async (req, res) => {
    const newCusTicket = new CusTicket(req.body);

    try {
        const saved = await newCusTicket.save();
        res.status(200).json(saved);
    } catch (err) {
        res.status(500).json(err);
    }
}