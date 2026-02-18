let ioInstance;

exports.initializeSocket = (io) => {
  ioInstance = io;

  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    socket.on("busLocationUpdate", (data) => {
      io.emit("liveLocation", data);
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected:", socket.id);
    });
  });
};

exports.getIO = () => ioInstance;
