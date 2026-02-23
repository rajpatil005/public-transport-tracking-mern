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

import Route from "./models/Route.js";

dotenv.config();
connectDB();

const app = express();

/* Middleware */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

/* Routes */
app.use("/api/auth", authRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/booking", bookingRoutes);

/* Socket Server */

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

/* ================= TRACKING ENGINE ================= */

let routeCoordinates = [];
let simulationTimer = null;

/* ⭐ REALISTIC MOTION PHYSICS */
const SPEED = 0.00012;

/* Load Path */
async function loadRoute() {
  try {
    const route = await Route.findOne();

    if (!route?.path?.length) return;

    routeCoordinates = route.path.map((p) => [p.lat, p.lng]);

    console.log("✅ Tracking Path Loaded →", routeCoordinates.length);

    if (!simulationTimer) startSimulation();
  } catch (err) {
    console.log(err.message);
  }
}

/* ⭐ Production Grade Smooth Engine */

function startSimulation() {
  if (routeCoordinates.length < 2) return;

  if (simulationTimer) clearInterval(simulationTimer);

  let progress = 0;

  simulationTimer = setInterval(() => {
    progress += SPEED;

    if (progress > 1) progress = 0;

    const segmentCount = routeCoordinates.length - 1;

    const virtualPos = progress * segmentCount;

    const i = Math.floor(virtualPos);
    const j = Math.min(i + 1, segmentCount);

    const ratio = virtualPos - i;

    const A = routeCoordinates[i];
    const B = routeCoordinates[j];

    if (!A || !B) return;

    const lat = A[0] + (B[0] - A[0]) * ratio;
    const lng = A[1] + (B[1] - A[1]) * ratio;

    io.emit("bus-location-update", {
      busId: "MH09-1234",
      latitude: lat,
      longitude: lng,
    });
  }, 60); // ⭐ Realistic smooth animation
}

/* Socket Events */

io.on("connection", (socket) => {
  console.log("✅ Socket Connected:", socket.id);

  socket.on("track-bus", (busId) => {
    socket.join(busId);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket Disconnected:", socket.id);
  });
});

/* Error Handler */

app.use(errorHandler);

/* Server Start */

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

/* Load Route */

loadRoute();
