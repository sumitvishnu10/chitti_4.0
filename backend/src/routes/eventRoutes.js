const express = require("express");
const router = express.Router();

const {
  createEvent,
  getEvents,
  updateEventStatus,
} = require("../controllers/eventController");

router.post("/", createEvent);
router.get("/", getEvents);
router.put("/:id/status", updateEventStatus);

module.exports = router;
