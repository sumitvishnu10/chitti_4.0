const express = require("express");
const cors = require("cors");
const deviceRoutes = require("./routes/deviceRoutes");
const authRoutes = require("./routes/authRoutes");

const eventRoutes = require("./routes/eventRoutes");
const alertRoutes = require("./routes/alertRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
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