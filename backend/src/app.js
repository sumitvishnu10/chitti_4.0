const express = require("express");
const cors = require("cors");
const deviceRoutes = require("./routes/deviceRoutes");
const authRoutes = require("./routes/authRoutes");

const eventRoutes = require("./routes/eventRoutes");
const alertRoutes = require("./routes/alertRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const dashboardRoutes = require("./routes/dashboardRoutes");
const systemRoutes = require("./routes/systemRoutes");
const sensorRoutes = require("./routes/sensorRoutes");
const { createSensorData } = require("./controllers/sensorController");


const app = express();

const corsOptions = {
  origin: ['http://10.64.138.175:5173', 'http://localhost:5173', 'http://127.0.0.1:5173'],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
app.use(express.json());


// Routes
app.post("/api/device/data", createSensorData);

app.use("/api/sensors", sensorRoutes);
app.use("/api/system", systemRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/auth", authRoutes);

// Global Logging Middleware
app.use((req, res, next) => {
  console.log(`Incoming: ${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.json({
    project: "CHITTI 4.0",
    status: "Backend Running"
  });
});

module.exports = app;