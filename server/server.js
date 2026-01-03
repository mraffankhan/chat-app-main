import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";
import translationRoutes from "./routes/translation.routes.js";
import aiRoutes from "./routes/ai.routes.js";

import { connectToMongoDB } from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";
dotenv.config();

const PORT = process.env.PORT;

app.use(
  cors({
    origin: ["http://localhost:5173", "https://chat-app-omega-lac.vercel.app"],
    credentials: true,
    methods: ["GET", "POST"],
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);
app.use("/api/translate", translationRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
  res.send("Oye Hoye swagat hai aapka!!!");
});

app.get("*", (req, res) => {
  res.send("Bad Request");
});

server.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});
