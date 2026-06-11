const EventLog = require("../models/EventLog");

const getAnalytics = async (req, res) => {
  try {
    const totalEvents = await EventLog.countDocuments();

    const sensorStats = await EventLog.aggregate([
      {
        $group: {
          _id: "$sensor",
          count: { $sum: 1 }
        }
      }
    ]);

    const statusStats = await EventLog.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      totalEvents,
      sensorStats,
      statusStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { getAnalytics };