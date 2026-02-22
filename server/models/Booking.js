import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  busId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bus",
    required: true,
  },
  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Route",
    required: true,
  },
  seats: [
    {
      seatNumber: Number,
      passengerName: String,
      passengerAge: Number,
      passengerGender: String,
    },
  ],
  totalFare: {
    type: Number,
    required: true,
  },
  bookingDate: {
    type: Date,
    default: Date.now,
  },
  travelDate: {
    type: Date,
    required: true,
  },
  departureTime: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["confirmed", "cancelled", "completed", "pending"],
    default: "confirmed",
  },
  paymentId: String,
  paymentMethod: {
    type: String,
    enum: ["cash", "card", "upi", "wallet"],
    default: "cash",
  },
  qrCode: String,
});

// Generate booking ID before saving
bookingSchema.pre("save", async function (next) {
  if (!this.bookingId) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");

    this.bookingId = `KBT${year}${month}${random}`;
  }
  next();
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
