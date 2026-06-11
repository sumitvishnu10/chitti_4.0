const express = require("express");
const router = express.Router();

const {
  createDevice,
  getDevices,
  getDeviceStatus,
} = require("../controllers/deviceController");

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

// POST /api/devices
router.post(
  "/",
  protect,
  authorize("admin"),
  createDevice
);

// GET /api/devices
router.get(
  "/",
  protect,
  authorize("admin", "farmer"),
  getDevices
);

// GET /api/devices/status
router.get(
  "/status",
  protect,
  authorize("admin", "farmer"),
  getDeviceStatus
);

module.exports = router;