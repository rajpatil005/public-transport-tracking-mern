const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema({
  routeName: String,
  startPoint: String,
  endPoint: String,
  stops: [
    {
      name: String,
      lat: Number,
      lng: Number
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Route", routeSchema);
