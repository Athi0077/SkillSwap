const Review = require("../models/Review");
const Swap = require("../models/Swap");
const User = require("../models/User");

// Helper to update user rating
const updateUserRating = async (userId) => {
  const reviews = await Review.find({ reviewee: userId });
  const average =
    reviews.length === 0
      ? 0
      : reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      
  await User.findByIdAndUpdate(userId, { rating: average });
};

// Add Review
const addReview = async (req, res) => {
  try {
    // Prevent duplicate reviews for the same reviewee by the same reviewer
    const existing = await Review.findOne({
      reviewer: req.user._id,
      reviewee: req.body.reviewee,
    });

    if (existing) {
      // Update instead of duplicate
      existing.rating = req.body.rating;
      existing.comment = req.body.comment;
      await existing.save();

      await updateUserRating(req.body.reviewee);

      const populated = await Review.findById(existing._id)
        .populate("reviewer", "name profileImage")
        .populate("reviewee", "name profileImage");

      return res.json({ success: true, review: populated });
    }

    const review = await Review.create({
      reviewer: req.user._id,
      reviewee: req.body.reviewee,
      rating: req.body.rating,
      comment: req.body.comment,
    });

    await updateUserRating(req.body.reviewee);

    const populated = await Review.findById(review._id)
      .populate("reviewer", "name profileImage")
      .populate("reviewee", "name profileImage");

    res.status(201).json({ success: true, review: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get reviews written BY the logged-in user
const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewer: req.user._id })
      .populate("reviewer", "name profileImage")
      .populate("reviewee", "name profileImage")
      .sort({ createdAt: -1 });

    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get reviews OF a specific user (received reviews)
const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate("reviewer", "name profileImage")
      .sort({ createdAt: -1 });

    const average =
      reviews.length === 0
        ? 0
        : reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    res.json({
      success: true,
      totalReviews: reviews.length,
      averageRating: average.toFixed(1),
      reviews,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete review
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: "Review not found" });

    await Review.findByIdAndDelete(req.params.id);
    
    // Update the rating for the user who lost the review
    await updateUserRating(review.reviewee);

    res.json({ success: true, message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get accepted swap partners for the logged-in user
const getAcceptedSwapUsers = async (req, res) => {
  try {
    const swaps = await Swap.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
      status: "accepted",
    })
      .populate("sender", "name profileImage bio location skillsOffered skillsWanted rating")
      .populate("receiver", "name profileImage bio location skillsOffered skillsWanted rating");

    // Deduplicate: get the other person from each swap
    const seenIds = new Set();
    const users = [];
    swaps.forEach((swap) => {
      const other =
        String(swap.sender._id) === String(req.user._id)
          ? swap.receiver
          : swap.sender;
      if (other && !seenIds.has(String(other._id))) {
        seenIds.add(String(other._id));
        users.push(other);
      }
    });

    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addReview,
  getMyReviews,
  getUserReviews,
  deleteReview,
  getAcceptedSwapUsers,
};