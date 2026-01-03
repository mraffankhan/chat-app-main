import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://chat-app-omega-lac.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const userSocketMap = {};

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId !== undefined) {
    userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }

  // Handle real-time message sending
  socket.on("sendMessage", (message) => {
    console.log("Message received:", message);

    const receiverSocketId = getReceiverSocketId(message.receiverId);
    if (receiverSocketId) {
      // Send the message directly to the receiver if they're online
      io.to(receiverSocketId).broadcast("newMessage", message);
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);

    // Remove user from online users
    if (userId) {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

export { app, io, server };
