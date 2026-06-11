const express = require("express");
const router = express.Router();

const {
  createSensorData,
  getSensorData,
} = require("../controllers/sensorController");

router.post("/", createSensorData);
router.get("/", getSensorData);

module.exports = router;