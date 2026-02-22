import Route from "../models/Route.js";

export const initializeSocket = (io) => {
  let routeCoordinates = [];
  let currentIndex = 0;

  /* Load Route Path */
  async function loadRoutePath() {
    try {
      const route = await Route.findOne();

      if (!route?.path?.length) {
        console.log("❌ No route path found");
        return;
      }

      routeCoordinates = route.path.map((p) => ({
        lat: Number(p.lat),
        lng: Number(p.lng),
      }));

      console.log("✅ Socket Path Loaded →", routeCoordinates.length, "nodes");
    } catch (err) {
      console.error("Route Load Error:", err.message);
    }
  }

  loadRoutePath();

  /* Socket Connection */

  io.on("connection", (socket) => {
    console.log("✅ Socket Connected:", socket.id);

    socket.on("track-bus", (busId) => {
      socket.join(busId);
      console.log("👀 Tracking Room Joined →", busId);
    });

    /* ⭐ Movement Engine */

    let movementInterval = setInterval(() => {
      if (!routeCoordinates.length) return;

      const busId = "MH09-1234";

      const path = routeCoordinates;

      const point = path[currentIndex];

      if (!point) return;

      io.to(busId).emit("bus-location-update", {
        busId,
        latitude: point.lat,
        longitude: point.lng,
      });

      currentIndex++;

      if (currentIndex >= path.length) {
        currentIndex = 0;
      }
    }, 180);

    socket.on("disconnect", () => {
      console.log("❌ Socket Disconnected:", socket.id);
      clearInterval(movementInterval);
    });
  });
};
