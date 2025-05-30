// config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Mongoose.connect returns a Promise
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Exit process with failure if unable to connect to DB
    process.exit(1);
  }
};

module.exports = connectDB;
