import api from "./api";

// Send a skill swap request
export const sendRequest = async (requestData) => {
  try {
    const { data } = await api.post("/swaps", requestData);
    return data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to send request",
      }
    );
  }
};

// Get all requests for logged-in user
export const getMyRequests = async () => {
  try {
    const [incoming, outgoing] = await Promise.all([
      api.get("/swaps/incoming"),
      api.get("/swaps/outgoing")
    ]);
    return { requests: [...(incoming.data.requests || []), ...(outgoing.data.requests || [])] };
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to fetch requests",
      }
    );
  }
};

// Get a single request
export const getRequestById = async (id) => {
  try {
    const { data } = await api.get(`/swaps/${id}`);
    return data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to fetch request",
      }
    );
  }
};

// Accept request
export const acceptRequest = async (id) => {
  try {
    const { data } = await api.put(`/swaps/${id}/status`, { status: "accepted" });
    return data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to accept request",
      }
    );
  }
};

// Reject request
export const rejectRequest = async (id) => {
  try {
    const { data } = await api.put(`/swaps/${id}/status`, { status: "rejected" });
    return data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to reject request",
      }
    );
  }
};

// Cancel request
export const cancelRequest = async (id) => {
  try {
    const { data } = await api.put(`/swaps/${id}/status`, { status: "cancelled" });
    return data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to cancel request",
      }
    );
  }
};

// End session (complete request)
export const completeRequest = async (id) => {
  try {
    const { data } = await api.put(`/swaps/${id}/status`, { status: "completed" });
    return data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to end session",
      }
    );
  }
};

// Delete request
export const deleteRequest = async (id) => {
  try {
    const { data } = await api.delete(`/swaps/${id}`);
    return data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to delete request",
      }
    );
  }
};