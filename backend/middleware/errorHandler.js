const ApiError = require("../utils/ApiError");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error("ERROR MESSAGE:", err.message);

  if (err.name === "CastError") {
    const message = `Resource not found with id of ${err.value}. Invalid ${err.path}`;
    error = new ApiError(404, message);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const message = `Duplicate field value entered: '${value}' for field '${field}'. Please use another value.`;
    error = new ApiError(400, message);
  }

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    const message = `Invalid input data. ${messages.join(". ")}`;
    error = new ApiError(400, message);
  }

  // JWT Errors
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token. Please log in again.";
    error = new ApiError(401, message);
  }
  if (err.name === "TokenExpiredError") {
    const message = "Your session has expired. Please log in again.";
    error = new ApiError(401, message);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
};

module.exports = errorHandler;
