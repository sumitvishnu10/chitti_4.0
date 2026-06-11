const mongoose = require("mongoose");

const eventLogSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
    },
    sensor: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    deterrent: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      default: "",
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("EventLog", eventLogSchema);