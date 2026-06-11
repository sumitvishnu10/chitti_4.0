const express = require("express");
const router = express.Router();

const {
    createDevice,
    getDevices,
    getDeviceStatus
} = require("../controllers/deviceController");

// POST /api/devices
router.post("/", createDevice);

// GET /api/devices
router.get("/", getDevices);

// GET /api/devices/status
router.get("/status", getDeviceStatus);

module.exports = router;