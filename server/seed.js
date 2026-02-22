import mongoose from "mongoose";
import Route from "./models/Route.js";
import Bus from "./models/Bus.js";
import User from "./models/User.js";

import { kolhapurRoutes, kolhapurBuses } from "./data/kolhapurData.js";

/* ================= DATABASE CONNECT ================= */

mongoose.connect("mongodb://localhost:27017/kolhapurDB");

mongoose.connection.once("open", async () => {
  try {
    console.log("MongoDB Connected");

    /* ================= CLEAR OLD DATA ================= */

    await Route.deleteMany({});
    await Bus.deleteMany({});

    // Remove only admin users
    await User.deleteMany({ role: "admin" });

    /* ================= SEED ADMIN USER ================= */

    // ❗ IMPORTANT — Do NOT hash password here.
    // Schema pre-save middleware will hash automatically.

    await User.create({
      name: "Admin",
      email: "admin@bus.com",
      password: "admin123",
      role: "admin",
    });

    console.log("✅ Admin seeded");

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

    console.log("✅ Data Inserted Successfully !!");

    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
});
