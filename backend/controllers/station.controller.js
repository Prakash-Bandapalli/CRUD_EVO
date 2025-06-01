const Station = require("../models/station.model");
const asyncHandler = require("../middleware/asyncHandler");
const ApiError = require("../utils/ApiError");

const createStation = asyncHandler(async (req, res, next) => {
  req.body.createdBy = req.user._id;

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

const getAllStations = asyncHandler(async (req, res, next) => {
  // Find ALL stations, but still populate createdBy to know who made it
  const stations = await Station.find({}).populate("createdBy", "email name");

  res.status(200).json({
    success: true,
    count: stations.length,
    data: stations,
  });
});

const getStationById = asyncHandler(async (req, res, next) => {
  const station = await Station.findById(req.params.id);

  if (!station) {
    return next(
      new ApiError(404, `Station not found with id of ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    data: station,
  });
});

const updateStation = asyncHandler(async (req, res, next) => {
  let station = await Station.findById(req.params.id);

  if (!station) {
    return next(
      new ApiError(404, `Station not found with id of ${req.params.id}`)
    );
  }

  if (req.body.createdBy) {
    delete req.body.createdBy;
  }

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
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Charging station updated successfully",
    data: station,
  });
});

const deleteStation = asyncHandler(async (req, res, next) => {
  const station = await Station.findById(req.params.id);

  if (!station) {
    return next(
      new ApiError(404, `Station not found with id of ${req.params.id}`)
    );
  }

  await station.deleteOne();

  res.status(200).json({
    success: true,
    message: "Charging station deleted successfully",
    data: {},
  });
});

module.exports = {
  createStation,
  getAllStations,
  getStationById,
  updateStation,
  deleteStation,
};
