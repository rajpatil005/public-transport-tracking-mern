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

/* ================= MIDDLEWARE ================= */

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

/* ================= SERVER SOCKET ================= */

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

/* ================= TRACKING ENGINE ================= */

let routeCoordinates = [];
let currentIndex = 0;
let step = 0;

const stepsPerSegment = 25;

/* Load Route Path */

async function loadRoute() {
  try {
    const route = await Route.findOne();

    if (!route || !route.path || route.path.length === 0) {
      console.log("❌ No route path found");
      return;
    }

    routeCoordinates = route.path.map((p) => [p.lat, p.lng]);

    console.log("✅ Tracking Path Loaded →", routeCoordinates.length, "nodes");

    startSimulation();
  } catch (err) {
    console.error("Route load error:", err.message);
  }
}

/* ⭐ Smooth OSRM Path Simulation Engine */

let timer;

function startSimulation() {
  if (!routeCoordinates.length) return;

  if (timer) clearInterval(timer);

  timer = setInterval(() => {
    if (routeCoordinates.length < 2) return;

    const from = routeCoordinates[currentIndex];

    const to = routeCoordinates[(currentIndex + 1) % routeCoordinates.length];

    const latStep = (to[0] - from[0]) / stepsPerSegment;
    const lngStep = (to[1] - from[1]) / stepsPerSegment;

    const lat = from[0] + latStep * step;
    const lng = from[1] + lngStep * step;

    io.to("MH09-1234").emit("bus-location-update", {
      busId: "MH09-1234",
      latitude: lat,
      longitude: lng,
    });

    step++;

    if (step >= stepsPerSegment) {
      step = 0;
      currentIndex++;

      if (currentIndex >= routeCoordinates.length - 1) {
        currentIndex = 0;
      }
    }

    console.log("🚍 Bus moving on OSRM path...");
  }, 180);
}

/* ================= SOCKET CONNECTION ================= */

io.on("connection", (socket) => {
  console.log("✅ Socket Connected:", socket.id);

  socket.on("track-bus", (busId) => {
    socket.join(busId);
    console.log("👀 Joined room:", busId);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket Disconnected:", socket.id);
  });
});

/* ================= ERROR HANDLER ================= */

app.use(errorHandler);

/* ================= SERVER START ================= */

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

/* Load Route */

loadRoute();
