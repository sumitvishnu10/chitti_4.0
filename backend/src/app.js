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


const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/sensors", sensorRoutes);
app.use("/api/system", systemRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({
    project: "CHITTI 4.0",
    status: "Backend Running"
  });
});

module.exports = app;