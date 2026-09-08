import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import nodemailer from "nodemailer";

import connectDB from "./config/db.js";
import errorHandler from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import busRoutes from "./routes/busRoutes.js";
import routeRoutes from "./routes/routeRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

import emailRoutes, { initEmailTransporter } from "./routes/emailRoutes.js";
import smsRoutes from "./routes/smsRoutes.js";

import { startTrackingEngine } from "./utils/trackingEngine.js";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5173",
  process.env.CLIENT_URL,
    "https://public-transport-tracking-mern-3.onrender.com",

].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      
      // Check if origin is allowed
      if (allowedOrigins.includes(origin) || origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        return callback(null, true); // For development, allow all
      }
    },
    credentials: true,
  })
);

let transporter = null;

// Only create transporter if credentials are set
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  try {
    transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify transporter connection
    transporter.verify((error, success) => {
      if (error) {
        console.error("❌ Email transporter error:", error.message);
        console.error("Please check your EMAIL_USER and EMAIL_PASS in .env file");
      } else {
        console.log("✅ Email transporter ready!");
      }
    });
  } catch (error) {
    console.error("❌ Failed to create email transporter:", error.message);
  }
} else {
  console.warn("⚠️ Email credentials not set. Email sending will not work.");
  console.warn("Please set EMAIL_USER and EMAIL_PASS in .env file");
}

// Initialize email routes with transporter
if (transporter) {
  initEmailTransporter(transporter);
}

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/chat", aiRoutes);

// Email Routes
app.use("/api/email", emailRoutes);

// SMS Routes
app.use("/api/sms", smsRoutes);

app.get("/", (req, res) => {
  res.send("🚀 API Running - Kolhapur City Bus Transport");
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    emailConfigured: !!transporter,
    emailUser: process.env.EMAIL_USER || "not configured",
    smsProvider: process.env.SMS_PROVIDER || "not configured",
    environment: process.env.NODE_ENV || "development",
    routes: {
      email: "/api/email/*",
      sms: "/api/sms/*",
      auth: "/api/auth/*",
      buses: "/api/buses/*",
      routes: "/api/routes/*",
      booking: "/api/booking/*",
      chat: "/api/chat/*"
    }
  });
});

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

startTrackingEngine(io);

app.use(errorHandler);


const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📧 Email service: ${process.env.EMAIL_USER || "not configured"}`);
  console.log(`📱 SMS service: ${process.env.SMS_PROVIDER || "not configured"}`);
  console.log(`🔗 Client URL: ${process.env.CLIENT_URL || "http://localhost:3000"}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
});