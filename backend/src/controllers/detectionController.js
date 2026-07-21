const Detection = require("../models/Detection");

// Create a new detection
exports.createDetection = async (req, res) => {
  try {
    const detection = await Detection.create(req.body);

    res.status(201).json({
      success: true,
      message: "Detection saved successfully",
      data: detection,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to save detection",
      error: error.message,
    });
  }
};

// Get all detections
exports.getAllDetections = async (req, res) => {
  try {
    const detections = await Detection.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: detections.length,
      data: detections,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch detections",
      error: error.message,
    });
  }
};

// Get latest detection
exports.getLatestDetection = async (req, res) => {
  try {
    const detection = await Detection.findOne().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: detection,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch latest detection",
      error: error.message,
    });
  }
};