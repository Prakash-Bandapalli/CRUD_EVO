// server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const { startKeepAlive, stopKeepAlive } = require("./utils/keepAlive"); // Adjust path

const authRoutes = require("./routes/auth.routes");
const stationRoutes = require("./routes/station.routes");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();
connectDB();
const app = express();

// --- CORS Configuration ---
// Define allowed origins
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:8080", // Example: Vue CLI default local port
  "http://localhost:5173", // Example: Vite default local port
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    // OR if origin is in allowedOrigins
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // If your frontend needs to send cookies or authorization headers
};

app.use(cors(corsOptions));
// --- End CORS Configuration ---

startKeepAlive(); // Start Keep Alive service

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/stations", stationRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  stopKeepAlive();
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
  setTimeout(() => {
    process.exit(1);
  }, 10000);
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received: closing HTTP server");
  stopKeepAlive();
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
  setTimeout(() => {
    process.exit(1);
  }, 10000);
});
