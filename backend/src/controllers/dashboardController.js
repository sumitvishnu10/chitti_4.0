const Device = require("../models/Device");
const EventLog = require("../models/EventLog");
const Alert = require("../models/Alert");

const getDashboardSummary = async (req, res) => {
  try {
    const totalDevices = await Device.countDocuments();
    const totalEvents = await EventLog.countDocuments();
    const totalAlerts = await Alert.countDocuments();

    const unreadAlerts = await Alert.countDocuments({
      status: "UNREAD",
    });

    res.json({
      success: true,
      summary: {
        totalDevices,
        totalEvents,
        totalAlerts,
        unreadAlerts,
        systemStatus: "ONLINE",
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardSummary,
};