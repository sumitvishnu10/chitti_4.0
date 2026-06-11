const mongoose = require("mongoose");

const sensorDataSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
    },
    temperature: {
      type: Number,
      required: true,
    },
    humidity: {
      type: Number,
      required: true,
    },
    battery: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "SensorData",
  sensorDataSchema
);