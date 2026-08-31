
import mongoose from "mongoose";
import dotenv from "dotenv";
import Route from "./models/Route.js";
import Bus from "./models/Bus.js";
import User from "./models/User.js";
import { kolhapurRoutes, kolhapurBuses } from "./data/kolhapurData.js";

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB Atlas");

    // ============ DROP PROBLEMATIC INDEX ============
    try {
      // Drop the problematic registrationNumber index if it exists
      await Bus.collection.dropIndex("registrationNumber_1");
      console.log("🗑️ Dropped registrationNumber_1 index");
    } catch (error) {
      console.log("ℹ️ registrationNumber_1 index not found, continuing...");
    }

    // Also drop any other problematic indexes
    try {
      await Bus.collection.dropIndex("busNumber_1");
      console.log("🗑️ Dropped busNumber_1 index");
    } catch (error) {
      // Index might not exist, that's fine
    }

    await Route.deleteMany({});
    await Bus.deleteMany({});
    await User.deleteMany({ role: "admin" });
    console.log("🗑️ Cleared existing data");

    await User.create({
      name: "Admin",
      email: "admin@bus.com",
      password: "admin123",
      role: "admin",
    });
    console.log("✅ Admin Created");

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

    // ============ CREATE ROUTE MAP ============
    const routeMap = new Map();
    routes.forEach((route) => {
      routeMap.set(route.routeNumber, route._id);
    });

    // ============ FORMAT BUSES ============
    const buses = kolhapurBuses.map((bus) => {
      const routeId = routeMap.get(bus.routeNumber);
      const route = routes.find((r) => r.routeNumber === bus.routeNumber);

      return {
        busNumber: bus.busNumber,
        driverName: bus.driverName,
        capacity: bus.capacity,
        status: bus.status.toUpperCase(),
        route: routeId,
        currentLocation: route?.stops?.[0]
          ? {
              lat: route.stops[0].lat,
              lng: route.stops[0].lng,
            }
          : { lat: 0, lng: 0 },
        lastUpdate: new Date(),
      };
    });

    // Insert buses one by one to handle duplicates better
    let insertedCount = 0;
    for (const bus of buses) {
      try {
        await Bus.create(bus);
        insertedCount++;
        console.log(`  ✅ Inserted bus: ${bus.busNumber}`);
      } catch (error) {
        if (error.code === 11000) {
          console.log(`  ⚠️ Bus ${bus.busNumber} already exists, skipping...`);
        } else {
          console.error(`  ❌ Error inserting ${bus.busNumber}:`, error.message);
        }
      }
    }

    console.log(`✅ ${insertedCount} Buses Inserted Successfully`);

    // ============ VERIFY DATA ============
    const totalRoutes = await Route.countDocuments();
    const totalBuses = await Bus.countDocuments();
    const totalUsers = await User.countDocuments();

    console.log("\n📊 FINAL SUMMARY:");
    console.log(`  🗺️ Routes: ${totalRoutes}`);
    console.log(`  🚍 Buses: ${totalBuses}`);
    console.log(`  👤 Users: ${totalUsers}`);

    // Show all buses
    const allBuses = await Bus.find().populate("route");
    console.log("\n🚍 All Buses in Database:");
    allBuses.forEach((bus) => {
      console.log(`  🚌 ${bus.busNumber} → Route ${bus.route?.routeNumber || 'N/A'}`);
      console.log(`     Driver: ${bus.driverName}`);
      console.log(`     Status: ${bus.status}`);
    });

    console.log("\n🎉 ALL DATA SEEDED SUCCESSFULLY IN ATLAS 🚀");
    process.exit(0);
  } catch (error) {
    console.error("❌ SEED ERROR:", error);
    process.exit(1);
  }
};

seedDatabase();