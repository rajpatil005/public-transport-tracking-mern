io.on("connection", (socket) => {
  console.log("✅ Socket Connected:", socket.id);

  socket.on("track-bus", (busNumber) => {
    socket.join(busNumber);
  });

  /*
  ⭐ Driver Location Update
  */

  socket.on("driver-location-update", async (data) => {
    try {
      const { busId, latitude, longitude, speed, routePath } = data;

      if (!busId || !routePath?.length) return;

      /*
      ===============================
      PATH SNAPPING ⭐⭐⭐
      ===============================
      */

      let nearestPoint = null;
      let minDistance = Infinity;

      for (const pathPoint of routePath) {
        const dist = Math.hypot(
          latitude - pathPoint.lat,
          longitude - pathPoint.lng,
        );

        if (dist < minDistance) {
          minDistance = dist;
          nearestPoint = pathPoint;
        }
      }

      /*
      If path snapping fails → fallback raw GPS
      */

      const finalPosition = nearestPoint || {
        lat: latitude,
        lng: longitude,
      };

      io.to(busId).emit("bus-location-update", {
        busId,
        latitude: finalPosition.lat,
        longitude: finalPosition.lng,
        speed: speed || 0,
      });
    } catch (err) {
      console.error(err.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket Disconnected:", socket.id);
  });
});
