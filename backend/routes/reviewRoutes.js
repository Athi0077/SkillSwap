const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  addReview,
  getMyReviews,
  getUserReviews,
  deleteReview,
  getAcceptedSwapUsers,
} = require("../controllers/reviewController");

const router = express.Router();

router.post("/", protect, addReview);
router.get("/my", protect, getMyReviews);
router.get("/swap-users", protect, getAcceptedSwapUsers);
router.get("/:userId", getUserReviews);
router.delete("/:id", protect, deleteReview);

module.exports = router;