import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = io("http://127.0.0.1:5000", {
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Socket Connected");
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    return () => socket.disconnect();
  }, []);

  const on = (event, cb) => {
    socketRef.current?.on(event, cb);

    return () => socketRef.current?.off(event, cb);
  };

  const off = (event, cb) => {
    socketRef.current?.off(event, cb);
  };

  return (
    <SocketContext.Provider
      value={{
        isConnected,
        on,
        off,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
