import api from "./api";

// Get all skills
export const getAllSkills = async (params = {}) => {
  try {
    const { data } = await api.get("/skills", { params });
    return data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to fetch skills",
      }
    );
  }
};

// Get skill by ID
export const getSkillById = async (id) => {
  try {
    const { data } = await api.get(`/skills/${id}`);
    return data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to fetch skill",
      }
    );
  }
};

// Create a new skill
export const createSkill = async (skillData) => {
  try {
    const { data } = await api.post("/skills", skillData);
    return data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to create skill",
      }
    );
  }
};

// Update skill
export const updateSkill = async (id, skillData) => {
  try {
    const { data } = await api.put(`/skills/${id}`, skillData);
    return data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to update skill",
      }
    );
  }
};

// Delete skill
export const deleteSkill = async (id) => {
  try {
    const { data } = await api.delete(`/skills/${id}`);
    return data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to delete skill",
      }
    );
  }
};

// Search skills
export const searchSkills = async (keyword) => {
  try {
    const { data } = await api.get("/skills/search", {
      params: { keyword },
    });
    return data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Skill search failed",
      }
    );
  }
};