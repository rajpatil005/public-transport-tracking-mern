import Route from "../models/Route.js";

export const initializeSocket = (io) => {
  let routeCoordinates = [];
  let currentIndex = 0;

  async function loadRoutePath() {
    try {
      const route = await Route.findOne();

      if (!route?.path?.length) return;

      routeCoordinates = route.path.map((p) => ({
        lat: Number(p.lat),
        lng: Number(p.lng),
      }));

      console.log("✅ Tracking Path Loaded →", routeCoordinates.length);

      startMovementEngine();
    } catch (err) {
      console.error(err.message);
    }
  }

  function startMovementEngine() {
    const busId = "MH09-1234";

    setInterval(() => {
      if (!routeCoordinates.length) return;

      const point = routeCoordinates[currentIndex];

      if (!point) return;

      io.emit("bus-location-update", {
        busId,
        latitude: point.lat,
        longitude: point.lng,
      });

      currentIndex++;

      if (currentIndex >= routeCoordinates.length) {
        currentIndex = 0;
      }
    }, 150);
  }

  io.on("connection", (socket) => {
    console.log("✅ Socket Connected:", socket.id);
  });

  loadRoutePath();
};
