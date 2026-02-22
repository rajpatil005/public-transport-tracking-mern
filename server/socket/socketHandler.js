let ioInstance;

const Bus = require("../models/Bus");

exports.initializeSocket = (io) => {
  ioInstance = io;

  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    // Passenger joins a bus room
    socket.on("track-bus", (busId) => {
      socket.join(busId);
      console.log(`👀 Passenger joined room: ${busId}`);
    });

    // Driver sends location
    socket.on("driver-location-update", async (data) => {
      try {
        const { busId, latitude, longitude } = data;

        // Update in database
        await Bus.findOneAndUpdate(
          { busNumber: busId },
          {
            location: {
              lat: latitude,
              lng: longitude,
            },
          },
        );

        // Emit only to that bus room
        io.to(busId).emit("bus-location-update", {
          busId,
          latitude,
          longitude,
        });

        console.log(`📡 Location updated for bus ${busId}`);
      } catch (error) {
        console.error("Socket location update error:", error.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected:", socket.id);
    });
  });
};

exports.getIO = () => ioInstance;
