import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import errorHandler from "./middleware/errorHandler.js";

import busRoutes from "./routes/busRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import routeRoutes from "./routes/routeRoutes.js";

dotenv.config();
connectDB();

const app = express();

/*
====================================
MIDDLEWARE
====================================
*/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

/*
====================================
ROUTES
====================================
*/
app.use("/api/buses", busRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/routes", routeRoutes);

/*
====================================
SOCKET.IO SETUP 🚀
====================================
*/

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("✅ Socket Connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Socket Disconnected:", socket.id);
  });
});

/*
====================================
ERROR HANDLER
====================================
*/
app.use(errorHandler);

/*
====================================
START SERVER
====================================
*/
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
