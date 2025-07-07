import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import { connectDB } from "./src/database/db.js";
import { createSocketServer } from "./src/config/socket.js";
import authRouter from "./src/routes/authRouter.js";
import queueRouter from "./src/routes/queueRouter.js";
import roomRouter from "./src/routes/roomRouter.js";
import adminRouter from "./src/routes/adminRouter.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(helmet());

app.use(cors({
  origin: process.env.FRONTEND_URL
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

connectDB();

const server = http.createServer(app);

const io = createSocketServer(server);

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/auth", authRouter);
app.use("/queue", queueRouter);
app.use("/room", roomRouter);
app.use("/admin", adminRouter);


app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/welcome.html");
});

app.get("/test", (req, res) => {
  res.json({ message: "Test endpoint working" });
});

app.use((err, req, res, next) => {
  console.error("Global error handler:", err.message);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});
