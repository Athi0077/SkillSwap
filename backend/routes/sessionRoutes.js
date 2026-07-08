const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  createSession,
  getMySessions,
  updateSessionStatus,
} = require("../controllers/sessionController");

const router = express.Router();

router.post("/", protect, createSession);

router.get("/", protect, getMySessions);

router.put("/:id", protect, updateSessionStatus);

module.exports = router;