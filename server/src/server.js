import "dotenv/config";
import http from "http";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import app from "./app.js";
import { connectDatabase, isUsingMemoryDatabase } from "./config/db.js";
import { populateDemoData } from "./data/populateDemoData.js";
import Booking from "./models/Booking.js";
import User from "./models/User.js";

const port = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Unauthorized"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("_id role");

    if (!user) {
      return next(new Error("Unauthorized"));
    }

    socket.user = user;
    next();
  } catch (error) {
    next(new Error("Unauthorized"));
  }
});

io.on("connection", (socket) => {
  socket.on("booking:join", async (bookingId) => {
    try {
      const booking = await Booking.findById(bookingId).select("client provider chatEnabled");

      if (!booking) {
        return;
      }

      const canJoin =
        booking.client.equals(socket.user._id) ||
        booking.provider.equals(socket.user._id) ||
        socket.user.role === "admin";

      if (canJoin && booking.chatEnabled) {
        socket.join(`booking:${bookingId}`);
      }
    } catch (error) {
      console.error("Socket join failed:", error.message);
    }
  });
});

app.set("io", io);

connectDatabase()
  .then(async () => {
    if (isUsingMemoryDatabase()) {
      await populateDemoData({ reset: true });
      console.log("Demo data loaded into in-memory MongoDB");
    }

    server.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
