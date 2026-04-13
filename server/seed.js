import mongoose from "mongoose";
import dotenv from "dotenv";

import Route from "./models/Route.js";
import Bus from "./models/Bus.js";
import User from "./models/User.js";

import { kolhapurRoutes, kolhapurBuses } from "./data/kolhapurData.js";

dotenv.config();


mongoose.connect(process.env.MONGO_URI);

/* ================= ON CONNECT ================= */

mongoose.connection.once("open", async () => {
  try {
    console.log("✅ MongoDB Atlas Connected");

    /* ================= CLEAR OLD DATA ================= */

    await Route.deleteMany({});
    await Bus.deleteMany({});
    await User.deleteMany({ role: "admin" });

    /* ================= ADMIN USER ================= */

    await User.create({
      name: "Admin",
      email: "admin@bus.com",
      password: "admin123", // 🔐 auto hash होईल
      role: "admin",
    });

    console.log("✅ Admin Created");

    /* ================= FORMAT ROUTES ================= */

    const formattedRoutes = kolhapurRoutes.map((route) => ({
      routeNumber: route.routeNumber,
      routeName: route.name,
      startPoint: route.source,
      endPoint: route.destination,

      stops: route.stops.map((stop) => ({
        name: stop.name,
        lat: stop.latitude,
        lng: stop.longitude,
      })),

      path: route.path,
    }));

    const routes = await Route.insertMany(formattedRoutes);

    console.log(`✅ ${routes.length} Routes Inserted`);

    /* ================= ROUTE MAP ================= */

    const routeMap = new Map();

    routes.forEach((route) => {
      routeMap.set(route.routeNumber, route._id);
    });

    /* ================= FORMAT BUSES ================= */

    const buses = kolhapurBuses.map((bus) => {
      const routeId = routeMap.get(bus.routeNumber);
      const route = routes.find((r) => r.routeNumber === bus.routeNumber);

      return {
        busNumber: bus.busNumber,
        driverName: bus.driverName,
        capacity: bus.capacity,
        status: bus.status.toUpperCase(),
        route: routeId,
        location: route?.stops?.[0]
          ? {
              lat: route.stops[0].lat,
              lng: route.stops[0].lng,
            }
          : null,
      };
    });

    await Bus.insertMany(buses);

    console.log(`✅ ${buses.length} Buses Inserted`);

    console.log("🎉 ALL DATA SEEDED SUCCESSFULLY IN ATLAS 🚀");

    process.exit(0);
  } catch (error) {
    console.error("❌ SEED ERROR:", error);
    process.exit(1);
  }
});