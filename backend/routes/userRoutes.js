const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  getAllUsers,
  getUserById,
  getProfile,
  updateProfile,
  searchUsers,
  deductVideoCredits,
} = require("../controllers/userController");

const router = express.Router();

router.get("/profile", protect, getProfile);

router.put("/profile", protect, updateProfile);

router.post("/deduct-video-credits", protect, deductVideoCredits);

router.get("/search", protect, searchUsers);

router.get("/", getAllUsers);

router.get("/:id", getUserById);

module.exports = router;