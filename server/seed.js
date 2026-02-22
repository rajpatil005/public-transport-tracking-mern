import mongoose from "mongoose";
import Route from "./models/Route.js";
import Bus from "./models/Bus.js";

import { kolhapurRoutes, kolhapurBuses } from "./data/kolhapurData.js";

mongoose.connect("mongodb://localhost:27017/kolhapurDB");

mongoose.connection.once("open", async () => {
  try {
    console.log("MongoDB Connected");

    await Route.deleteMany({});
    await Bus.deleteMany({});

    // ✅ Format Routes Properly
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

    // Map routeNumber → route ObjectId
    const routeMap = new Map();
    routes.forEach((route) => {
      routeMap.set(route.routeNumber, route._id);
    });

    // ✅ Format Buses Properly (with initial location)
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

    console.log("Data Inserted Successfully !!");
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
});
