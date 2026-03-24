io.on("connection", (socket) => {
  console.log("✅ Socket Connected:", socket.id);

  /*
  ===============================
  JOIN ROOM (ROUTE BASED)
  ===============================
  */
  socket.on("track-bus", (routeNumber) => {
    socket.join(routeNumber);
    console.log(`🚌 Joined route room: ${routeNumber}`);
  });

  /*
  ===============================
  DRIVER LOCATION UPDATE
  ===============================
  */
  socket.on("driver-location-update", async (data) => {
    try {
      const { busId, routeNumber, latitude, longitude, speed, routePath } = data;

      if (!latitude || !longitude || !routePath?.length) return;

      /*
      ===============================
      PATH SNAPPING (IMPORTANT)
      ===============================
      */

      let nearestPoint = null;
      let minDistance = Infinity;

      for (const pathPoint of routePath) {
        const dist = Math.hypot(
          latitude - pathPoint.lat,
          longitude - pathPoint.lng
        );

        if (dist < minDistance) {
          minDistance = dist;
          nearestPoint = pathPoint;
        }
      }

      /*
      FINAL POSITION (SNAPPED TO ROAD)
      */
      const finalPosition = nearestPoint || {
        lat: latitude,
        lng: longitude,
      };

      /*
      ===============================
      EMIT TO CORRECT ROOM ⭐ FIX
      ===============================
      */
      io.to(routeNumber).emit("bus-location-update", {
        busId,
        routeNumber,
        latitude: finalPosition.lat,
        longitude: finalPosition.lng,
        speed: speed || 0,
      });

      console.log("📡 Emitted:", finalPosition);
    } catch (err) {
      console.error("Socket Error:", err.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket Disconnected:", socket.id);
  });
});