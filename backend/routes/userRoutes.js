const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  getAllUsers,
  getUserById,
  getProfile,
  updateProfile,
  uploadProfileImage,
  deleteProfileImage,
  searchUsers,
  deductVideoCredits,
  getLeaderboard,
} = require("../controllers/userController");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/profile", protect, getProfile);

router.put("/profile", protect, updateProfile);

router.post("/profile/image", protect, upload.single("image"), uploadProfileImage);
router.delete("/profile/image", protect, deleteProfileImage);

router.post("/deduct-video-credits", protect, deductVideoCredits);

router.get("/search", protect, searchUsers);

router.get("/leaderboard", protect, getLeaderboard);

router.get("/", getAllUsers);

router.get("/:id", getUserById);

module.exports = router;