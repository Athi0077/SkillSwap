import api from "./api";

// Get reviews I wrote
export const getMyReviews = async () => {
  try {
    const { data } = await api.get("/reviews/my");
    return data;
  } catch (error) {
    throw (error.response?.data || { success: false, message: "Failed to fetch reviews" });
  }
};

// Get users from accepted swaps (who I can review)
export const getAcceptedSwapUsers = async () => {
  try {
    const { data } = await api.get("/reviews/swap-users");
    return data;
  } catch (error) {
    throw (error.response?.data || { success: false, message: "Failed to fetch swap users" });
  }
};

// Get all reviews
export const getAllReviews = async () => {
  try {
    const { data } = await api.get("/reviews");
    return data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to fetch reviews",
      }
    );
  }
};

// Get reviews for a specific user
export const getUserReviews = async (userId) => {
  try {
    const { data } = await api.get(`/reviews/${userId}`);
    return data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to fetch user reviews",
      }
    );
  }
};

// Get review by ID
export const getReviewById = async (reviewId) => {
  try {
    const { data } = await api.get(`/reviews/${reviewId}`);
    return data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to fetch review",
      }
    );
  }
};

// Create review
export const createReview = async (reviewData) => {
  try {
    const { data } = await api.post("/reviews", reviewData);
    return data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to create review",
      }
    );
  }
};

// Update review
export const updateReview = async (reviewId, reviewData) => {
  try {
    const { data } = await api.put(`/reviews/${reviewId}`, reviewData);
    return data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to update review",
      }
    );
  }
};

// Delete review
export const deleteReview = async (reviewId) => {
  try {
    const { data } = await api.delete(`/reviews/${reviewId}`);
    return data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to delete review",
      }
    );
  }
};