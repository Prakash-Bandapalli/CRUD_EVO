// models/station.model.js
const mongoose = require("mongoose");

const stationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a station name"],
      trim: true,
      maxlength: [100, "Station name cannot be more than 100 characters"],
    },
    location: {
      // GeoJSON Point
      type: {
        type: String,
        enum: ["Point"], // 'location.type' must be 'Point'
        required: true,
        default: "Point",
      },
      coordinates: {
        type: [Number], // Array of numbers for longitude and latitude [lng, lat]
        required: [true, "Please provide coordinates (longitude, latitude)"],
        validate: {
          validator: function (coords) {
            // Basic validation: longitude between -180 and 180, latitude between -90 and 90
            return (
              Array.isArray(coords) &&
              coords.length === 2 &&
              coords[0] >= -180 &&
              coords[0] <= 180 &&
              coords[1] >= -90 &&
              coords[1] <= 90
            );
          },
          message:
            "Coordinates must be an array of two numbers: [longitude, latitude] within valid range.",
        },
      },
      address: {
        // Optional: A human-readable address string
        type: String,
        trim: true,
      },
    },
    status: {
      type: String,
      required: [true, "Please specify the station status"],
      enum: {
        values: ["Active", "Inactive", "Under Maintenance", "Coming Soon"],
        message:
          "{VALUE} is not a supported status. Supported statuses are: Active, Inactive, Under Maintenance, Coming Soon.",
      },
      default: "Active",
    },
    powerOutput: {
      // In kilowatts (kW)
      type: Number,
      required: [true, "Please specify the power output in kW"],
      min: [0.1, "Power output must be a positive value"],
    },
    connectorType: {
      type: String,
      required: [true, "Please specify the connector type"],
      // Consider using an enum if you have a predefined list of connector types
      // enum: ['Type 1 (J1772)', 'Type 2 (Mennekes)', 'CCS Combo 1', 'CCS Combo 2', 'CHAdeMO', 'Tesla (NACS)', 'Other'],
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // This creates a reference to the User model
      required: true, // Every station must be associated with a user who created it
    },
    // You could add more fields like:
    // - pricing (String or Object)
    // - amenities (Array of Strings)
    // - images (Array of Strings - URLs)
    // - operatingHours (String)
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Create a 2dsphere index on the location.coordinates field for geospatial queries
// This is important if you plan to do things like "find stations near a point"
stationSchema.index({ "location.coordinates": "2dsphere" });

// Compile the schema into a model
const Station = mongoose.model("Station", stationSchema);

module.exports = Station;
