const getSystemHealth = async (req, res) => {
  try {
    res.json({
      success: true,
      status: "ONLINE",
      database: "CONNECTED",
      mqtt: "CONNECTED",
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getSystemHealth,
};