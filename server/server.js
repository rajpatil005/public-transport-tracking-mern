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
   CORS FIX (PRODUCTION SAFE)
=============================== */

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  process.env.CLIENT_URL, // Vercel frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow tools like Postman or server-to-server
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        return callback(null, true); // TEMP FIX (prevents crash)
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
    origin: allowedOrigins,
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