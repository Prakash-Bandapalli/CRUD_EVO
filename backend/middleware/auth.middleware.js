// middleware/auth.middleware.js
const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler"); // Your async wrapper
const User = require("../models/user.model");
const ApiError = require("../utils/ApiError"); // Your custom error class

// Protect routes
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in Authorization header (Bearer token)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header (Bearer <token>)
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token's ID and attach to request object
      // Exclude the password when fetching the user
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        // This case might happen if a user was deleted after the token was issued
        return next(
          new ApiError(401, "Not authorized, user not found for this token")
        );
      }

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.error("Token verification error:", error);
      // Handle specific JWT errors if needed (e.g., TokenExpiredError, JsonWebTokenError)
      // The global error handler will catch these if not handled here more specifically.
      return next(new ApiError(401, "Not authorized, token failed"));
    }
  }

  if (!token) {
    return next(new ApiError(401, "Not authorized, no token provided"));
  }
});

// Optional: Middleware to authorize based on user roles (if you implement roles)
// const authorize = (...roles) => {
//   return (req, res, next) => {
//     if (!req.user || !roles.includes(req.user.role)) { // Assuming user model has a 'role' field
//       return next(
//         new ApiError(403, `User role ${req.user ? req.user.role : 'none'} is not authorized to access this route`)
//       );
//     }
//     next();
//   };
// };

module.exports = { protect /*, authorize */ };
