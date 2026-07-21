const mongoose = require("mongoose");

const detectionSchema = new mongoose.Schema(
  {
    animal: {
      type: String,
      required: true,
    },

    confidence: {
      type: Number,
      required: true,
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },

    image: {
      type: String,
      required: true,
    },

    camera: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Detection", detectionSchema);