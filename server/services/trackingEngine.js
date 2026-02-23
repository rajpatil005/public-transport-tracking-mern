import Route from "../models/Route.js";

export const startTrackingEngine = (io) => {
  let pathPoints = [];
  let currentSegment = 0;
  let progress = 0;

  const BUS_SPEED_KMH = 32; // 🔥 Updated realistic city speed
  const UPDATE_INTERVAL = 100;

  function toRad(value) {
    return (value * Math.PI) / 180;
  }

  function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  async function loadPath() {
    try {
      const route = await Route.findOne();

      if (!route?.path?.length) {
        console.log("❌ No route path found");
        return;
      }

      pathPoints = route.path.map((p) => ({
        lat: Number(p.lat),
        lng: Number(p.lng),
      }));

      console.log("✅ Tracking Path Loaded →", pathPoints.length);

      startEngine();
    } catch (err) {
      console.error("Route Load Error:", err.message);
    }
  }

  function startEngine() {
    setInterval(() => {
      if (pathPoints.length < 2) return;

      const start = pathPoints[currentSegment];
      const end = pathPoints[currentSegment + 1];

      if (!end) {
        currentSegment = 0;
        progress = 0;
        return;
      }

      const segmentDistance = getDistance(
        start.lat,
        start.lng,
        end.lat,
        end.lng,
      );

      const distancePerTick = (BUS_SPEED_KMH / 3600) * (UPDATE_INTERVAL / 1000);

      const step = distancePerTick / segmentDistance;

      progress += step;

      if (progress >= 1) {
        progress = progress - 1;
        currentSegment++;

        if (currentSegment >= pathPoints.length - 1) {
          currentSegment = 0;
        }
      }

      const newStart = pathPoints[currentSegment];
      const newEnd = pathPoints[currentSegment + 1];

      const lat = newStart.lat + (newEnd.lat - newStart.lat) * progress;

      const lng = newStart.lng + (newEnd.lng - newStart.lng) * progress;

      io.to("MH09-1234").emit("bus-location-update", {
        busId: "MH09-1234",
        latitude: lat,
        longitude: lng,
        speed: BUS_SPEED_KMH,
      });
    }, UPDATE_INTERVAL);
  }

  loadPath();
};
