// controllers/station.controller.js
const Station = require("../models/station.model");
const asyncHandler = require("../middleware/asyncHandler");
const ApiError = require("../utils/ApiError");

// @desc    Create a new charging station
// @route   POST /api/stations
// @access  Private (requires login)
const createStation = asyncHandler(async (req, res, next) => {
  // Add the logged-in user's ID to the request body
  // req.user is available because of the 'protect' middleware
  req.body.createdBy = req.user._id;

  // Validate location coordinates (ensure it's an array of two numbers)
  if (req.body.location && req.body.location.coordinates) {
    if (
      !Array.isArray(req.body.location.coordinates) ||
      req.body.location.coordinates.length !== 2
    ) {
      return next(
        new ApiError(
          400,
          "Location coordinates must be an array of two numbers: [longitude, latitude]"
        )
      );
    }
    // Further validation for lng/lat ranges is in the model
  } else if (req.body.location && !req.body.location.coordinates) {
    return next(new ApiError(400, "Location coordinates are required"));
  }

  const station = await Station.create(req.body);

  res.status(201).json({
    success: true,
    message: "Charging station created successfully",
    data: station,
  });
});

// @desc    Get all charging stations (for the logged-in user)
// @route   GET /api/stations
// @access  Private
const getAllStations = asyncHandler(async (req, res, next) => {
  // Find ALL stations, but still populate createdBy to know who made it
  const stations = await Station.find({}).populate("createdBy", "email name"); // Added 'name' to populate if you have it
  // Or just .populate('createdBy') to get all user fields (except password)

  res.status(200).json({
    success: true,
    count: stations.length,
    data: stations,
  });
});

// @desc    Get a single charging station by ID
// @route   GET /api/stations/:id
// @access  Private
const getStationById = asyncHandler(async (req, res, next) => {
  const station = await Station.findById(req.params.id);

  if (!station) {
    return next(
      new ApiError(404, `Station not found with id of ${req.params.id}`)
    );
  }

  // Authorization: Check if the logged-in user is the owner of the station
  if (station.createdBy.toString() !== req.user._id.toString()) {
    return next(
      new ApiError(403, "User not authorized to access this station") // 403 Forbidden
    );
  }

  res.status(200).json({
    success: true,
    data: station,
  });
});

// @desc    Update a charging station
// @route   PUT /api/stations/:id
// @access  Private
const updateStation = asyncHandler(async (req, res, next) => {
  let station = await Station.findById(req.params.id);

  if (!station) {
    return next(
      new ApiError(404, `Station not found with id of ${req.params.id}`)
    );
  }

  // Authorization: Check if the logged-in user is the owner of the station
  if (station.createdBy.toString() !== req.user._id.toString()) {
    return next(
      new ApiError(403, "User not authorized to update this station")
    );
  }

  // Prevent createdBy field from being updated directly
  if (req.body.createdBy) {
    delete req.body.createdBy;
  }
  // Prevent location.type from being changed from 'Point' if it's part of the update
  if (
    req.body.location &&
    req.body.location.type &&
    req.body.location.type !== "Point"
  ) {
    return next(
      new ApiError(400, "Location type cannot be changed from 'Point'")
    );
  }

  station = await Station.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // Return the modified document rather than the original
    runValidators: true, // Ensure that schema validations are run on update
  });

  res.status(200).json({
    success: true,
    message: "Charging station updated successfully",
    data: station,
  });
});

// @desc    Delete a charging station
// @route   DELETE /api/stations/:id
// @access  Private
const deleteStation = asyncHandler(async (req, res, next) => {
  const station = await Station.findById(req.params.id);

  if (!station) {
    return next(
      new ApiError(404, `Station not found with id of ${req.params.id}`)
    );
  }

  // Authorization: Check if the logged-in user is the owner of the station
  if (station.createdBy.toString() !== req.user._id.toString()) {
    return next(
      new ApiError(403, "User not authorized to delete this station")
    );
  }

  await station.deleteOne(); // Mongoose v6+ way to remove document instance

  res.status(200).json({
    success: true,
    message: "Charging station deleted successfully",
    data: {}, // Or send status 204 No Content
  });
});

module.exports = {
  createStation,
  getAllStations,
  getStationById,
  updateStation,
  deleteStation,
};
