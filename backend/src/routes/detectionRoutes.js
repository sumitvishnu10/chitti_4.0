const express = require("express");
const router = express.Router();

const {
  createDetection,
  getAllDetections,
  getLatestDetection,
} = require("../controllers/detectionController");

// Save a new detection
router.post("/", createDetection);

// Get all detections
router.get("/", getAllDetections);

// Get latest detection
router.get("/latest", getLatestDetection);

module.exports = router;