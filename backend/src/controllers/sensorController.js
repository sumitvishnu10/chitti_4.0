const SensorData = require("../models/SensorData");

// POST Sensor Data
const createSensorData = async (req, res) => {
  try {
    const data = await SensorData.create(req.body);

    res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET Sensor Data
const getSensorData = async (req, res) => {
  try {
    const data = await SensorData.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createSensorData,
  getSensorData,
};