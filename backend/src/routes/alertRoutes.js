const express = require("express");
const router = express.Router();

const {
  createAlert,
  getAlerts,
  markAsRead,
} = require("../controllers/alertController");

router.post("/", createAlert);
router.get("/", getAlerts);
router.patch("/:id/read", markAsRead);

module.exports = router;