const Customer = require("../models/customer");

exports.getAll = async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).json(customers);
    } catch (err) {
        res.status(500).json({error:err});
    }
}

exports.getById = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        res.status(200).json(customer);
    } catch (err) {
        res.status(500).json({error:err});
    }
}

exports.create = async (req, res) => {
    const newCustomer = new Customer(req.body);
    
    try {
        const saved = await newCustomer.save();
        res.status(200).json(saved);
    } catch (err) {
        res.status(500).json(err);
    }
}

exports.update = async (req, res) => {
    try {
        const updated = await Customer.findByIdAndUpdate(
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
}

exports.deleteById = async (req, res) => {
    try {
        await Customer.findByIdAndDelete(req.params.id);
        res.status(200).json("Has been deleted");
      } catch (err) {
        res.status(500).json(err);
      }
}