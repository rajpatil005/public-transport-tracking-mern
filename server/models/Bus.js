const mongoose = require("mongoose");

const busSchema = new mongoose.Schema({
  busNumber: { type: String, required: true, unique: true },
  driverName: String,
  capacity: Number,
  route: { type: mongoose.Schema.Types.ObjectId, ref: "Route" },
  location: {
    lat: Number,
    lng: Number
  },
  status: {
    type: String,
    enum: ["ACTIVE", "INACTIVE"],
    default: "ACTIVE"
  }
}, { timestamps: true });

module.exports = mongoose.model("Bus", busSchema);
