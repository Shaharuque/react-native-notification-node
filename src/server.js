import "dotenv/config.js";
import cors from "cors";
import morgan from "morgan";
import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { connectDB } from "./db.js";
import buildNotificationRouter from "./routes/notifications.js";

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Socket.IO auth & rooms (optional per-user)
io.on("connection", (socket) => {
  // Expect optional userId query to join personal room
  const userId = socket.handshake.auth?.userId || socket.handshake.query?.userId;
  if (userId) {
    socket.join(`user:${userId}`);
    console.log(`🔌 socket joined room user:${userId}`);
  } else {
    console.log("🔌 client connected (no userId)");
  }

  socket.on("disconnect", () => {
    console.log("🔌 client disconnected2");
  });
});

// Routes
app.use("/notifications", buildNotificationRouter(io));

app.get("/", (_req, res) => res.send("RN Notifications Backend ✅"));

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await connectDB();
    server.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));
  } catch (e) {
    console.error("Failed to start server:", e);
    process.exit(1);
  }
})();
