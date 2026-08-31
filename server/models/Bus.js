// backend/models/Bus.js
import mongoose from "mongoose";

const busSchema = new mongoose.Schema(
  {
    busNumber: { 
      type: String, 
      required: true, 
      unique: true,
      index: true // This creates busNumber_1 index
    },
    driverName: { type: String, default: "" },
    capacity: { type: Number, default: 0 },
    route: { type: mongoose.Schema.Types.ObjectId, ref: "Route" },
    currentLocation: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },
    lastUpdate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "MAINTENANCE"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

// Ensure only busNumber index exists
busSchema.index({ busNumber: 1 }, { unique: true });

const Bus = mongoose.model("Bus", busSchema);

export default Bus;