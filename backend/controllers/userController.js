const User = require("../models/User");
const Skill = require("../models/Skills");

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get logged-in user
const getProfile = async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};

// Update profile
const updateProfile = async (req, res) => {
  try {
    const updates = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (updates.skillsOffered || updates.skillsWanted) {
      await Skill.deleteMany({ user: req.user._id });
      
      const newSkillsOffered = user.skillsOffered || [];
      const newSkillsWanted = user.skillsWanted || [];
      
      if (newSkillsOffered.length > 0) {
        await Promise.all(newSkillsOffered.map(skillName => 
          Skill.create({ user: user._id, name: skillName, type: "teach" })
        ));
      }
      
      if (newSkillsWanted.length > 0) {
        await Promise.all(newSkillsWanted.map(skillName => 
          Skill.create({ user: user._id, name: skillName, type: "learn" })
        ));
      }
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Search users by name or username
const searchUsers = async (req, res) => {
  try {
    const keyword = req.query.keyword || req.query.q;
    
    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const regex = new RegExp(keyword, "i");
    
    // Search by username or name, excluding the current logged-in user if req.user exists
    // (though search might not be protected or if protected we exclude req.user)
    const query = {
      $or: [{ username: regex }, { name: regex }],
    };

    if (req.user && req.user._id) {
      query._id = { $ne: req.user._id };
    }

    const users = await User.find(query).select("-password").limit(20);

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Deduct credits for video call
const deductVideoCredits = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || user.credits < 5) {
      return res.status(400).json({
        success: false,
        message: "Insufficient credits to join the video call.",
      });
    }

    user.credits -= 5;
    await user.save();

    res.json({
      success: true,
      message: "5 credits deducted",
      credits: user.credits,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get leaderboard
const getLeaderboard = async (req, res) => {
  try {
    // Sort users by credits descending, then by rating descending.
    // Limit to top 50 users.
    const users = await User.find()
      .select("name username profileImage credits rating skillsOffered")
      .sort({ credits: -1, rating: -1 })
      .limit(50);

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  getProfile,
  updateProfile,
  searchUsers,
  deductVideoCredits,
  getLeaderboard,
};