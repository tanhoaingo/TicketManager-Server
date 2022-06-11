const CusTicket = require('../models/cusTicket');

exports.create = async (req, res) => {
  const newCusTicket = new CusTicket(req.body);

  try {
    const saved = await newCusTicket.save();
    res.status(200).json(saved);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.updateCancel = async (req, res) => {
  const id = req.body.id;
  try {
    const updatedCusTicket = await CusTicket.findByIdAndUpdate(
      id,
      {
        isCancel: true,
      },
      { new: true }
    );
    if (updatedCusTicket) {
      return res.json({
        success: true,
        message: 'cancel ticket successfully',
      });
    } else {
      return res.json({
        success: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'server has problem',
    });
  }
};
