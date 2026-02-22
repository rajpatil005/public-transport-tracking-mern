// client/src/context/SocketProvider.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { io } from "socket.io-client"; // ✅ FIXED IMPORT

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [socketInstance, setSocketInstance] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketUrl =
      process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";

    console.log("🔌 Connecting socket →", socketUrl);

    const socket = io(socketUrl, {
      transports: ["websocket"], // ✅ force websocket (prevents polling bugs)
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
      withCredentials: true,
    });

    socketRef.current = socket;
    setSocketInstance(socket);

    socket.on("connect", () => {
      console.log("✅ Socket Connected:", socket.id);
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket Disconnected");
      setIsConnected(false);
    });

    socket.on("connect_error", (err) => {
      console.log("⚠️ Socket Connection Error:", err.message);
      setIsConnected(false);
    });

    return () => {
      console.log("🔌 Socket Cleanup Triggered");

      socket.removeAllListeners();
      socket.disconnect();

      socketRef.current = null;
      setSocketInstance(null);
    };
  }, []);

  const emit = useCallback(
    (event, data, callback) => {
      const socket = socketRef.current;

      if (socket && isConnected) {
        socket.emit(event, data, callback);
        return true;
      }

      console.warn("⚠️ Socket emit failed — not connected");
      return false;
    },
    [isConnected],
  );

  const on = useCallback((event, callback) => {
    const socket = socketRef.current;

    if (!socket) return () => {};

    socket.on(event, callback);

    return () => socket.off(event, callback);
  }, []);

  const off = useCallback((event, callback) => {
    const socket = socketRef.current;
    if (socket) socket.off(event, callback);
  }, []);

  const value = useMemo(
    () => ({
      socket: socketInstance,
      isConnected,
      emit,
      on,
      off,
      socketId: socketInstance?.id,
    }),
    [socketInstance, isConnected, emit, on, off],
  );

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
