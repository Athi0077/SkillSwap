import api from "./api";

// Register a new user
export const registerUser = async (userData) => {
  try {
    const response = await api.post("/auth/signup", userData);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Registration failed",
      }
    );
  }
};

// Login user
export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Login failed",
      }
    );
  }
};

// Get current logged-in user
export const getCurrentUser = async () => {
  try {
    const response = await api.get("/users/profile");
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to fetch user",
      }
    );
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    const response = await api.post("/auth/logout");
    return response.data;
  } catch (error) {
    // Clear local storage even if backend logout fails
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    throw (
      error.response?.data || {
        success: false,
        message: "Logout failed",
      }
    );
  }
};