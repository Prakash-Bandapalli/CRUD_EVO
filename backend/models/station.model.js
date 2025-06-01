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

      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create a 2dsphere index on the location.coordinates field for geospatial queries
stationSchema.index({ "location.coordinates": "2dsphere" });

const Station = mongoose.model("Station", stationSchema);

module.exports = Station;
