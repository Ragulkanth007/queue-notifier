
import { io } from "socket.io-client";

let socket;

export const connectSocket = (token) => {
  if (!socket && token) {
    socket = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      // If authentication fails, clear the socket
      if (error.message.includes("Authentication error")) {
        disconnectSocket();
      }
    });
  }
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
