// middleware/errorHandler.js
const ApiError = require("../utils/ApiError"); // Assuming you created this custom error class

const errorHandler = (err, req, res, next) => {
  let error = { ...err }; // Create a copy to avoid mutating the original err object directly

  error.message = err.message; // Ensure message property is set

  // Log to console for the developer (can be enhanced with a proper logger like Winston)
  console.error("ERROR STACK:", err.stack); // Log the full error stack for debugging
  console.error("ERROR MESSAGE:", err.message); // Log just the message

  // Mongoose Bad ObjectId Error (CastError)
  if (err.name === "CastError") {
    const message = `Resource not found with id of ${err.value}. Invalid ${err.path}`;
    error = new ApiError(404, message); // Use 404 for "not found" due to bad ID format
  }

  // Mongoose Duplicate Key Error (E11000)
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

  // JWT Errors (can add more specific JWT error handling if needed)
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token. Please log in again.";
    error = new ApiError(401, message);
  }
  if (err.name === "TokenExpiredError") {
    const message = "Your session has expired. Please log in again.";
    error = new ApiError(401, message);
  }

  // Send the response
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
    // Optionally, send stack trace in development mode only
    // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

module.exports = errorHandler;
