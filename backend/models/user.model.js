// models/user.model.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    // name: { // Optional: if you want to store user's name
    //   type: String,
    //   required: [true, 'Please provide a name'],
    //   trim: true,
    // },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true, // Ensures email addresses are unique in the collection
      lowercase: true, // Converts email to lowercase before saving
      trim: true, // Removes whitespace from both ends of a string
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, // Basic email format validation
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false, // By default, do not return the password field when querying users
    },
    // You can add other fields like 'role', 'avatar', etc. later if needed
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Mongoose Middleware: Pre-save hook to hash password before saving a new user
// Note: Must be a regular function, not an arrow function, to correctly use 'this'
userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified (or is new)
  if (!this.isModified("password")) {
    return next();
  }

  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10); // 10 is a common salt round value
    // Hash the password using the new salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error); // Pass error to the next middleware (error handler)
  }
});

// Mongoose Instance Method: To compare entered password with the hashed password in the database
// Note: Must be a regular function
userSchema.methods.matchPassword = async function (enteredPassword) {
  // 'this.password' refers to the hashed password of the user instance
  return await bcrypt.compare(enteredPassword, this.password);
};

// Compile the schema into a model
const User = mongoose.model("User", userSchema);

module.exports = User;
