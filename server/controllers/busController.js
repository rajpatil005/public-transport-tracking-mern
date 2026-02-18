const Bus = require("../models/Bus");

exports.getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find().populate("route");
    res.json(buses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;

    const bus = await Bus.findByIdAndUpdate(
      req.params.id,
      { location: { lat, lng } },
      { new: true }
    );

    res.json(bus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
