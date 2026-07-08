const EventLog = require("../models/EventLog");

// Create Event
const createEvent = async (req, res) => {
  try {
    const event = await EventLog.create(req.body);

    res.status(201).json({
      success: true,
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Events
const getEvents = async (req, res) => {
  try {
    const events = await EventLog.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Event Status
const updateEventStatus = async (req, res) => {
  try {
    const updateData = { status: req.body.status };
    if (req.body.imageUrl) {
      updateData.imageUrl = req.body.imageUrl;
    }

    const event = await EventLog.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.json({
      success: true,
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createEvent,
  getEvents,
  updateEventStatus,
};