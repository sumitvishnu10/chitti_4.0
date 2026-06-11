const express = require("express");
const router = express.Router();

const {
  getSystemHealth,
} = require("../controllers/systemController");

router.get("/health", getSystemHealth);

module.exports = router;