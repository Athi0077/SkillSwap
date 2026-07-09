import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/hubs`
  : "http://localhost:5000/api/hubs";

const getConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

export const createHub = async (hubData) => {
  const response = await axios.post(API_URL, hubData, getConfig());
  return response.data;
};

export const getHubs = async () => {
  const response = await axios.get(API_URL, getConfig());
  return response.data;
};

export const getHubById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, getConfig());
  return response.data;
};

export const joinHub = async (id) => {
  const response = await axios.post(`${API_URL}/${id}/join`, {}, getConfig());
  return response.data;
};

export const leaveHub = async (id) => {
  const response = await axios.post(`${API_URL}/${id}/leave`, {}, getConfig());
  return response.data;
};

export const getHubMessages = async (id) => {
  const response = await axios.get(`${API_URL}/${id}/messages`, getConfig());
  return response.data;
};
