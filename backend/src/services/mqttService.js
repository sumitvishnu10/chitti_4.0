const mqtt = require("mqtt");

const EventLog = require("../models/EventLog");
const Alert = require("../models/Alert");

const client = mqtt.connect("mqtt://test.mosquitto.org:1883");

console.log("Starting MQTT...");

client.on("connect", () => {
  console.log("✅ MQTT Connected");

  client.subscribe("chitti/device/data", (err) => {
    if (err) {
      console.log("❌ Subscribe Error:", err);
    } else {
      console.log("📡 Subscribed to chitti/device/data");
    }
  });
});

client.on("message", async (topic, message) => {
  try {
    console.log("================================");
    console.log("📡 Topic:", topic);

    const data = JSON.parse(message.toString());

    console.log("📨 Message:", data);

    // Save Event Log
    const event = await EventLog.create({
      deviceId: data.deviceId,
      sensor: data.sensor,
      status: data.status,
      deterrent: "AUTO MQTT",
    });

    console.log("✅ Event Saved:", event._id);

    // Create Alert
    const alert = await Alert.create({
      deviceId: data.deviceId,
      type: "WILDLIFE_DETECTED",
      message: `${data.sensor} Sensor Triggered`,
      severity: "HIGH",
    });

    console.log("🚨 Alert Created:", alert._id);

    console.log("================================");
  } catch (error) {
    console.error("MQTT Processing Error:", error.message);
  }
});

module.exports = client;