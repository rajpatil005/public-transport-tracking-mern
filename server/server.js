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

/* ================= APP INIT ================= */

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

/* ================= ROUTES ================= */

app.use("/api/auth", authRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/booking", bookingRoutes);

/* ================= HTTP + SOCKET SERVER ================= */

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.set("io", io);

/* ================= SOCKET CONNECTION ================= */

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

/* ================= START SMART TRACKING ENGINE ================= */

startTrackingEngine(io);

/* ================= ERROR HANDLER ================= */

app.use(errorHandler);

/* ================= SERVER START ================= */

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
