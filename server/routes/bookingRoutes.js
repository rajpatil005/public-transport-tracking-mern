import express from "express";
const router = express.Router();

import {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  checkAvailability,
} from "../controllers/bookingController.js";

import { protect } from "../middleware/auth.js";

router.post("/check-availability", protect, checkAvailability);
router.get("/my-bookings", protect, getMyBookings);

router.route("/").post(protect, createBooking);

router.route("/:id").get(protect, getBookingById).put(protect, cancelBooking);

export default router;
