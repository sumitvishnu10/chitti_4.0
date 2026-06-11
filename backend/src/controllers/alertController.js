const Alert = require("../models/Alert");

// Create Alert
const createAlert = async (req, res) => {
  try {
    const alert = await Alert.create(req.body);

    res.status(201).json({
      success: true,
      data: alert,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Alerts
const getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Mark Alert as Read
const markAsRead = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { status: "READ" },
      { new: true }
    );

    res.json({
      success: true,
      data: alert,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createAlert,
  getAlerts,
  markAsRead,
};