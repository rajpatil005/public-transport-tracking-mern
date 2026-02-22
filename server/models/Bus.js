import mongoose from "mongoose";

const busSchema = new mongoose.Schema(
  {
    busNumber: { type: String, required: true, unique: true },
    driverName: String,
    capacity: Number,
    route: { type: mongoose.Schema.Types.ObjectId, ref: "Route" },
    location: {
      lat: Number,
      lng: Number,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  { timestamps: true },
);

const Bus = mongoose.model("Bus", busSchema);

export default Bus;
