import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import errorHandler from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import busRoutes from "./routes/busRoutes.js";
import routeRoutes from "./routes/routeRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

import { startTrackingEngine } from "./utils/trackingEngine.js";

dotenv.config();
connectDB();

const app = express();

/* ===============================
   BODY PARSER
=============================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ===============================
   CORS FIX (PRODUCTION READY)
=============================== */
const allowedOrigins = [
  "http://localhost:3000",
  process.env.CLIENT_URL, // Vercel frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);

/* ===============================
   TEST ROUTE
=============================== */
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

/* ===============================
   ROUTES
=============================== */
app.use("/api/auth", authRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/booking", bookingRoutes);

/* ===============================
   SERVER + SOCKET SETUP
=============================== */
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("✅ Socket Connected:", socket.id);

  socket.on("track-bus", (routeNumber) => {
    socket.join(routeNumber);
    console.log("👀 Tracking Route Room →", routeNumber);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket Disconnected:", socket.id);
  });
});

/* ===============================
   TRACKING ENGINE
=============================== */
startTrackingEngine(io);

/* ===============================
   ERROR HANDLER
=============================== */
app.use(errorHandler);

/* ===============================
   START SERVER
=============================== */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});