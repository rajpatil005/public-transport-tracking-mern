const mongoose = require('mongoose');

const liveLocationSchema = new mongoose.Schema({
  busId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
    required: true
  },
  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route'
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  speed: {
    type: Number,
    default: 0
  },
  heading: {
    type: Number,
    default: 0
  },
  nextStop: String,
  stopsAway: Number,
  eta: Number,
  occupancy: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Index for automatic deletion after 1 hour
liveLocationSchema.index({ timestamp: 1 }, { expireAfterSeconds: 3600 });

module.exports = mongoose.model('LiveLocation', liveLocationSchema);