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
  },
});

/* Tracking Engine */

let pathPoints = [];
let index = 0;

const SPEED = 0.00005;

async function loadPath() {
  try {
    const route = await Route.findOne();

    if (!route?.path?.length) return;

    pathPoints = route.path.map((p) => ({
      lat: Number(p.lat),
      lng: Number(p.lng),
    }));

    console.log("✅ Tracking Path Loaded →", pathPoints.length);

    startEngine();
  } catch (err) {
    console.error(err.message);
  }
}

function startEngine() {
  setInterval(() => {
    if (pathPoints.length < 2) return;

    const point = pathPoints[index];

    io.to("MH09-1234").emit("bus-location-update", {
      busId: "MH09-1234",
      latitude: point.lat,
      longitude: point.lng,
    });

    index++;

    if (index >= pathPoints.length) index = 0;
  }, 220);
}

/* Socket Connection */

io.on("connection", (socket) => {
  console.log("✅ Socket Connected:", socket.id);

  socket.join("MH09-1234");
});

/* Error Handler */

app.use(errorHandler);

/* Server Start */

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

/* Load Path */

loadPath();
