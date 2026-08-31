import mongoose from "mongoose";

const driverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    trim: true
  },
  bus: {
    type: String,
    trim: true
  },
  routeNumber: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ["active", "on-leave", "inactive", "suspended"],
    default: "active"
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 4.0
  },
  trips: {
    type: Number,
    default: 0
  },
  experience: {
    type: String
  },
  joinDate: {
    type: String
  },
  licenseNumber: {
    type: String
  },
  emergencyContact: {
    name: String,
    phone: String,
    relation: String
  }
}, {
  timestamps: true
});

const Driver = mongoose.model("Driver", driverSchema);
export default Driver;