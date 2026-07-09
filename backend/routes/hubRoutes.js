const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  createHub,
  getAllHubs,
  getHubById,
  joinHub,
  leaveHub,
  getHubMessages,
} = require("../controllers/hubController");

router.route("/").post(protect, createHub).get(protect, getAllHubs);
router.route("/:id").get(protect, getHubById);
router.route("/:id/join").post(protect, joinHub);
router.route("/:id/leave").post(protect, leaveHub);
router.route("/:id/messages").get(protect, getHubMessages);

module.exports = router;
