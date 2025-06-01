const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../middleware/asyncHandler");
const ApiError = require("../utils/ApiError");

const registerUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ApiError(400, "Please provide an email and password"));
  }
  if (password.length < 6) {
    return next(new ApiError(400, "Password must be at least 6 characters"));
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return next(new ApiError(400, "User already exists with this email"));
  }

  const user = await User.create({
    email,
    password,
  });

  if (user) {
    const userResponse = {
      _id: user._id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

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

const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ApiError(400, "Please provide an email and password"));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ApiError(401, "Invalid credentials - user not found"));
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ApiError(401, "Invalid credentials - password incorrect"));
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
