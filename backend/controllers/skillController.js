const Skill = require("../models/Skills");

// Add Skill
const addSkill = async (req, res) => {
  try {
    const skill = await Skill.create({
      ...req.body,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      skill,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get My Skills
const getMySkills = async (req, res) => {
  const skills = await Skill.find({ user: req.user._id });

  res.json({
    success: true,
    skills,
  });
};

// Get all skills
const getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.find().populate(
      "user",
      "name email profileImage location availability"
    );

    res.json({
      success: true,
      skills,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Search skills
const searchSkills = async (req, res) => {
  try {
    const { keyword } = req.query;

    const skills = await Skill.find({
      name: {
        $regex: keyword,
        $options: "i",
      },
    }).populate("user", "name email profileImage location availability");


    res.json({
      success: true,
      skills,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Skill
const deleteSkill = async (req, res) => {
  await Skill.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: "Skill deleted successfully",
  });
};

module.exports = {
  addSkill,
  getMySkills,
  deleteSkill,
  getAllSkills,
  searchSkills,
};