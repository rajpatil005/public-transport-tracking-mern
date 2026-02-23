import Route from "../models/Route.js";

export const initializeTrackingEngine = (io) => {
  let pathPoints = [];
  let index = 0;

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

  io.on("connection", (socket) => {
    socket.join("MH09-1234");
    console.log("✅ Socket Connected:", socket.id);
  });

  loadPath();
};
