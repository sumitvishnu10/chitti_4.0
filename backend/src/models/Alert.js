const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  deviceId: String,
  type: String,
  message: String,
  severity: String,
  status: {
    type: String,
    default: "UNREAD"
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Alert", alertSchema);