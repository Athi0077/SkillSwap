const User = require("../models/User");
const Skill = require("../models/Skills");
const generateToken = require("../utils/generateToken");

// Signup
const signup = async (req, res) => {
  try {
    const { name, username, email, password, bio, location, gender, skillsOffered, skillsWanted, socialLinks } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    if (username) {
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({
          success: false,
          message: "Username already exists",
        });
      }
    }

    const user = await User.create({
      name,
      username,
      email,
      password,
      bio,
      location,
      gender,
      skillsOffered,
      skillsWanted,
      socialLinks,
    });

    if (skillsOffered && skillsOffered.length > 0) {
      await Promise.all(skillsOffered.map(skillName => 
        Skill.create({ user: user._id, name: skillName, type: "teach" })
      ));
    }

    if (skillsWanted && skillsWanted.length > 0) {
      await Promise.all(skillsWanted.map(skillName => 
        Skill.create({ user: user._id, name: skillName, type: "learn" })
      ));
    }

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token: generateToken(user._id),
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    res.json({
      success: true,
      message: "Login successful",
      token: generateToken(user._id),
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}; 

module.exports = {
  signup,
  login,
};