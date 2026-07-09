const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  createHub,
  getAllHubs,
  getHubById,
  joinHub,
  leaveHub,
} = require("../controllers/hubController");

router.route("/").post(protect, createHub).get(protect, getAllHubs);
router.route("/:id").get(protect, getHubById);
router.route("/:id/join").post(protect, joinHub);
router.route("/:id/leave").post(protect, leaveHub);

module.exports = router;
