import Route from "../models/Route.js";

/*
====================================================
SMART MULTI ROUTE TRACKING ENGINE 🚀
====================================================
*/

export const startTrackingEngine = (io) => {
  const BUS_SPEED_KMH = 32;
  const UPDATE_INTERVAL = 100;

  function toRad(value) {
    return (value * Math.PI) / 180;
  }

  function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  async function startEngine() {
    const routes = await Route.find();

    if (!routes.length) {
      console.log("❌ No routes found for tracking engine");
      return;
    }

    console.log("✅ Tracking Engine Loaded Routes →", routes.length);

    const routeMap = new Map();
    const segmentMap = new Map();
    const progressMap = new Map();

    routes.forEach((route) => {
      if (route.path?.length) {
        routeMap.set(
          route.routeNumber,
          route.path.map((p) => ({
            lat: Number(p.lat),
            lng: Number(p.lng),
          })),
        );

        segmentMap.set(route.routeNumber, 0);
        progressMap.set(route.routeNumber, 0);
      }
    });

    setInterval(() => {
      routeMap.forEach((pathPoints, routeNumber) => {
        if (!pathPoints || pathPoints.length < 2) return;

        let currentSegment = segmentMap.get(routeNumber);
        let progress = progressMap.get(routeNumber);

        const start = pathPoints[currentSegment];
        const end = pathPoints[currentSegment + 1];

        if (!end) {
          segmentMap.set(routeNumber, 0);
          progressMap.set(routeNumber, 0);
          return;
        }

        const segmentDistance = getDistance(
          start.lat,
          start.lng,
          end.lat,
          end.lng,
        );

        const distancePerTick =
          (BUS_SPEED_KMH / 3600) * (UPDATE_INTERVAL / 1000);

        const step = distancePerTick / segmentDistance;

        progress += step;

        if (progress >= 1) {
          progress -= 1;
          currentSegment++;

          if (currentSegment >= pathPoints.length - 1) {
            currentSegment = 0;
          }
        }

        segmentMap.set(routeNumber, currentSegment);
        progressMap.set(routeNumber, progress);

        const newStart = pathPoints[currentSegment];
        const newEnd = pathPoints[currentSegment + 1];

        if (!newStart || !newEnd) return;

        const lat = newStart.lat + (newEnd.lat - newStart.lat) * progress;

        const lng = newStart.lng + (newEnd.lng - newStart.lng) * progress;

        /* ⭐ CRITICAL FIX */
        io.to(routeNumber).emit("bus-location-update", {
          routeNumber: routeNumber,
          busId: routeNumber,
          latitude: lat,
          longitude: lng,
          speed: BUS_SPEED_KMH,
        });
      });
    }, UPDATE_INTERVAL);
  }

  startEngine();
};
