const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  sendSwapRequest,
  getIncomingRequests,
  getOutgoingRequests,
  updateSwapStatus,
  deleteSwapRequest,
} = require("../controllers/swapController");

const router = express.Router();

router.post("/", protect, sendSwapRequest);
router.get("/incoming", protect, getIncomingRequests);
router.get("/outgoing", protect, getOutgoingRequests);
router.put("/:id/status", protect, updateSwapStatus);
router.delete("/:id", protect, deleteSwapRequest);

module.exports = router;
