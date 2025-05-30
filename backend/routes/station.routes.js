// routes/station.routes.js
const express = require("express");
const {
  createStation,
  getAllStations,
  getStationById,
  updateStation,
  deleteStation,
} = require("../controllers/station.controller");
const { protect } = require("../middleware/auth.middleware"); // Import the protect middleware

const router = express.Router();

// Apply the 'protect' middleware to all routes in this file
// This means a user must be logged in to access any of these station endpoints
router.use(protect);

// Define routes
router
  .route("/")
  .post(createStation) // POST /api/stations
  .get(getAllStations); // GET  /api/stations

router
  .route("/:id")
  .get(getStationById) // GET    /api/stations/:id
  .put(updateStation) // PUT    /api/stations/:id
  .delete(deleteStation); // DELETE /api/stations/:id

module.exports = router;
