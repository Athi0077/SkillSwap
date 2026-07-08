import api from "./api";

// Get all conversations for logged-in user
export const getChats = async () => {
  try {
    const { data } = await api.get("/chat/conversations");
    return data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to fetch chats",
      }
    );
  }
};

// Get messages of a specific chat
export const getMessages = async (chatId) => {
  try {
    const { data } = await api.get(`/chat/${chatId}`);
    return data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to fetch messages",
      }
    );
  }
};

// Send a message
export const sendMessage = async (chatId, messageData) => {
  try {
    const { data } = await api.post(
      `/chat/${chatId}`,
      messageData
    );
    return data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to send message",
      }
    );
  }
};

// Mark messages as read
export const markAsRead = async (chatId) => {
  try {
    const { data } = await api.put(`/chats/${chatId}/read`);
    return data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to mark messages as read",
      }
    );
  }
};

// Delete a message
export const deleteMessage = async (messageId) => {
  try {
    const { data } = await api.delete(`/chats/messages/${messageId}`);
    return data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to delete message",
      }
    );
  }
};