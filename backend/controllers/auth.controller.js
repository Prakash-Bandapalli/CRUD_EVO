// controllers/auth.controller.js
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../middleware/asyncHandler"); // Optional: for cleaner async/await
const ApiError = require("../utils/ApiError"); // Optional: for custom error handling

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return next(new ApiError(400, "Please provide an email and password"));
  }
  if (password.length < 6) {
    return next(new ApiError(400, "Password must be at least 6 characters"));
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    return next(new ApiError(400, "User already exists with this email"));
  }

  // Create user (password will be hashed by the pre-save hook in user.model.js)
  const user = await User.create({
    email,
    password,
  });

  if (user) {
    // Don't send password back, even the hashed one, unless explicitly needed
    const userResponse = {
      _id: user._id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    // Generate token (optional here, but good practice to return it if auto-login after register)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: userResponse,
      token, // Send token so frontend can log user in immediately
    });
  } else {
    return next(
      new ApiError(500, "User registration failed. Please try again.")
    );
  }
});

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return next(new ApiError(400, "Please provide an email and password"));
  }

  // Find user by email (explicitly select password as it's select: false in schema)
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ApiError(401, "Invalid credentials - user not found")); // Generic message
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ApiError(401, "Invalid credentials - password incorrect")); // Generic message
  }

  // User authenticated, generate token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  // Prepare user data to send back (excluding password)
  const userResponse = {
    _id: user._id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  res.status(200).json({
    success: true,
    message: "User logged in successfully",
    user: userResponse,
    token,
  });
});

module.exports = {
  registerUser,
  loginUser,
};
