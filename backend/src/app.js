const express = require("express");
const cors = require("cors");
const deviceRoutes = require("./routes/deviceRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/devices", deviceRoutes);

app.get("/", (req, res) => {
  res.json({
    project: "CHITTI 4.0",
    status: "Backend Running"
  });
});

module.exports = app;