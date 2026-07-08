import api from "./api";

export const getMySchedules = async () => {
  try {
    const { data } = await api.get("/sessions");
    // controller returns { success, schedules }
    return { schedules: data.schedules || [] };
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to fetch schedules",
      }
    );
  }
};

// Accept a session
export const acceptSchedule = async (id) => {
  try {
    const { data } = await api.put(`/sessions/${id}`, { status: "accepted" });
    return data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to accept schedule",
      }
    );
  }
};

// Get schedule by ID
export const getScheduleById = async (id) => {
  try {
    const { data } = await api.get(`/sessions/${id}`);
    return data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to fetch schedule",
      }
    );
  }
};

// Create a new schedule
export const createSchedule = async (scheduleData) => {
  try {
    const { data } = await api.post("/sessions", scheduleData);
    return data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to create schedule",
      }
    );
  }
};

// Update schedule
export const updateSchedule = async (id, scheduleData) => {
  try {
    const { data } = await api.put(`/sessions/${id}`, scheduleData);
    return data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to update schedule",
      }
    );
  }
};

// Cancel schedule
export const cancelSchedule = async (id) => {
  try {
    const { data } = await api.put(`/sessions/${id}`, { status: "cancelled" });
    return data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to cancel schedule",
      }
    );
  }
};

// Complete schedule
export const completeSchedule = async (id) => {
  try {
    const { data } = await api.put(`/sessions/${id}`, { status: "completed" });
    return data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to complete schedule",
      }
    );
  }
};