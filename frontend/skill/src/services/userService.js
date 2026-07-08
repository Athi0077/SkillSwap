import api from "./api";

// Get logged-in user's profile
export const getMyProfile = async () => {
  try {
    const { data } = await api.get("/users/profile");
    return data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to fetch profile",
      }
    );
  }
};

// Get user profile by ID
export const getUserById = async (id) => {
  try {
    const { data } = await api.get(`/users/${id}`);
    return data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to fetch user",
      }
    );
  }
};

// Update logged-in user's profile
export const updateProfile = async (profileData) => {
  try {
    const { data } = await api.put("/users/profile", profileData);
    return data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to update profile",
      }
    );
  }
};

// Upload profile image
export const uploadProfileImage = async (formData) => {
  try {
    const { data } = await api.post("/users/profile/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Image upload failed",
      }
    );
  }
};

// Search users
export const searchUsers = async (keyword = "") => {
  try {
    const { data } = await api.get(`/users/search?keyword=${keyword}`);
    return data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Search failed",
      }
    );
  }
};

// Get all users
export const getAllUsers = async () => {
  try {
    const { data } = await api.get("/users");
    return data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to fetch users",
      }
    );
  }
};

// Get leaderboard
export const getLeaderboard = async () => {
  try {
    const { data } = await api.get("/users/leaderboard");
    return data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to fetch leaderboard",
      }
    );
  }
};