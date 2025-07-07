import { Server } from "socket.io";
import jwt from "jsonwebtoken";

export const createSocketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Authentication error: No token provided"));
    try {
      const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id, "user:", socket.user?.email);

    socket.on("message", (msg) => {
      console.log(`Message from ${socket.id}: ${msg}`);
      io.emit("message", msg);
    });

    socket.on("joinRoom", (roomId) => {
      socket.join(roomId.toString());
      console.log(`${socket.id} joined room ${roomId}`);
    });

    socket.on("leaveRoom", (roomId) => {
      socket.leave(roomId.toString());
      console.log(`${socket.id} left room ${roomId}`);
    });

    socket.on("joinQueue", (data) => {
      const { roomId } = data;
      console.log(`${socket.id} joining queue for room ${roomId}`);
      // The actual queue joining logic is handled by REST API
      // This socket event is for real-time notifications
      socket.to(roomId.toString()).emit("queueUpdate", {
        message: `User ${socket.user?.email} is joining the queue`,
        action: "join",
        userId: socket.user?.sub
      });
    });

    socket.on("leaveQueue", (data) => {
      const { roomId } = data;
      console.log(`${socket.id} leaving queue for room ${roomId}`);
      // The actual queue leaving logic is handled by REST API
      // This socket event is for real-time notifications
      socket.to(roomId.toString()).emit("queueUpdate", {
        message: `User ${socket.user?.email} is leaving the queue`,
        action: "leave",
        userId: socket.user?.sub
      });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};
