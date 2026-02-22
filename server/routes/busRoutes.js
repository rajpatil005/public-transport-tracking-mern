import express from "express";
import {
  getAllBuses,
  getBusById,
  getBusByNumber,
  updateLocation,
} from "../controllers/busController.js";

const router = express.Router();

/*
=====================================
BUS ROUTES
=====================================
*/

// Get all buses
router.get("/", getAllBuses);

// Get bus by MongoDB _id
router.get("/:id", getBusById);

// Get bus by busNumber
router.get("/number/:busNumber", getBusByNumber);

// Update bus location (Realtime tracking)
router.put("/location/:busNumber", updateLocation);

export default router;
