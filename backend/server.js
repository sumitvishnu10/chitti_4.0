require("dotenv").config();

// MQTT Service
require("./src/services/mqttService");

const app = require("./src/app");
const connectDB = require("./src/config/db");

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 CHITTI Backend running on port ${PORT}`);
});