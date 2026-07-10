const SensorData = require("../models/SensorData");

const Device = require("../models/Device");
const EventLog = require("../models/EventLog");
const Alert = require("../models/Alert");

// POST Sensor Data
const createSensorData = async (req, res) => {
  try {
    const { deviceId, temperature, humidity, battery, solarVoltage, pir, ultrasonic, vibration, buzzer, led, motor } = req.body;

    // 1. Save Historic Sensor Data (Keep only required schema fields)
    const data = await SensorData.create({
      deviceId, temperature, humidity, battery
    });

    // 2. Upsert Device Live State
    await Device.findOneAndUpdate(
      { deviceId },
      {
        battery: battery || 100,
        solarVoltage: solarVoltage || 0,
        temperature: temperature || 0,
        humidity: humidity || 0,
        pir: pir || false,
        ultrasonic: ultrasonic || false,
        vibration: vibration || false,
        buzzer: buzzer || false,
        led: led || false,
        camera: true,
        status: "Online"
      },
      { upsert: true, new: true }
    );

    // 3. Trigger Events and Alerts if intrusion detected
    let triggeredSensor = null;

    if (pir) triggeredSensor = "PIR";
    else if (ultrasonic) triggeredSensor = "ULTRASONIC";
    else if (vibration) triggeredSensor = "VIBRATION";

    if (triggeredSensor) {
      // Build deterrent string
      let deterrents = [];
      if (buzzer) deterrents.push("BUZZER");
      if (led) deterrents.push("LED");
      if (motor) deterrents.push("MOTOR");
      const deterrentStr = deterrents.length > 0 ? deterrents.join(" & ") : "NONE";

      // Create Event Log
      await EventLog.create({
        deviceId,
        sensor: triggeredSensor,
        status: "DETECTED",
        deterrent: deterrentStr
      });

      // Create Alert
      await Alert.create({
        deviceId,
        type: "WILDLIFE_DETECTED",
        message: `${triggeredSensor} Sensor Triggered`,
        severity: "HIGH"
      });
    }

    res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Sensor Data Processing Error:", error.message);
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