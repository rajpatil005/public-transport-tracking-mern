import Bus from "../models/Bus.js";
import mongoose from "mongoose";

/*
==================================================
GET ALL BUSES
==================================================
*/
export const getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find().populate("route");

    res.json({
      success: true,
      data: buses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
==================================================
GET BUS BY ID
==================================================
*/
export const getBusById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid bus _id",
      });
    }

    const bus = await Bus.findById(id).populate("route");

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }

    res.json({
      success: true,
      data: bus,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
==================================================
GET BUS BY BUS NUMBER
==================================================
*/
export const getBusByNumber = async (req, res) => {
  try {
    const bus = await Bus.findOne({
      busNumber: req.params.busNumber,
    }).populate("route");

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }

    res.json({
      success: true,
      data: bus,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
==================================================
UPDATE LOCATION + SOCKET BROADCAST 🚀
==================================================
*/
export const updateLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const busNumber = req.params.busNumber;

    const io = req.app.get("io");

    const bus = await Bus.findOneAndUpdate(
      { busNumber },
      {
        currentLocation: { lat, lng },
        lastUpdate: new Date(),
      },
      { new: true },
    ).populate("route");

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }

    // ✅ GLOBAL EVENT (MATCH FRONTEND)
    if (io) {
      io.emit("busLocationUpdate", {
        busId: bus._id,
        busNumber: bus.busNumber,
        latitude: lat,
        longitude: lng,
        status: bus.status,
      });
    }

    res.json({
      success: true,
      data: bus,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
