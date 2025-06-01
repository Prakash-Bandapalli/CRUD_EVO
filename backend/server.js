const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const { startKeepAlive, stopKeepAlive } = require("./utils/keepAlive");

const authRoutes = require("./routes/auth.routes");
const stationRoutes = require("./routes/station.routes");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();
connectDB();
const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:8080", // Vue CLI default local port
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

startKeepAlive();

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
