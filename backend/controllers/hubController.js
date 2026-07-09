const Hub = require("../models/Hub");

// Create a new Hub
const createHub = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Check if Hub already exists
    const existingHub = await Hub.findOne({ name });
    if (existingHub) {
      return res.status(400).json({
        success: false,
        message: "A Hub with this name already exists",
      });
    }

    const hub = await Hub.create({
      name,
      description,
      creator: req.user._id,
      members: [req.user._id], // Creator is automatically a member
    });

    res.status(201).json({
      success: true,
      hub,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all Hubs
const getAllHubs = async (req, res) => {
  try {
    const hubs = await Hub.find()
      .populate("creator", "name username profileImage")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      hubs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get a specific Hub by ID
const getHubById = async (req, res) => {
  try {
    const hub = await Hub.findById(req.params.id)
      .populate("creator", "name username profileImage")
      .populate("members", "name username profileImage skillsOffered rating");

    if (!hub) {
      return res.status(404).json({
        success: false,
        message: "Hub not found",
      });
    }

    res.json({
      success: true,
      hub,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Join a Hub
const joinHub = async (req, res) => {
  try {
    const hub = await Hub.findById(req.params.id);

    if (!hub) {
      return res.status(404).json({
        success: false,
        message: "Hub not found",
      });
    }

    if (hub.members.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: "You are already a member of this Hub",
      });
    }

    hub.members.push(req.user._id);
    await hub.save();

    res.json({
      success: true,
      message: "Joined Hub successfully",
      hub,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Leave a Hub
const leaveHub = async (req, res) => {
  try {
    const hub = await Hub.findById(req.params.id);

    if (!hub) {
      return res.status(404).json({
        success: false,
        message: "Hub not found",
      });
    }

    if (!hub.members.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: "You are not a member of this Hub",
      });
    }

    hub.members = hub.members.filter(
      (memberId) => memberId.toString() !== req.user._id.toString()
    );
    await hub.save();

    res.json({
      success: true,
      message: "Left Hub successfully",
      hub,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createHub,
  getAllHubs,
  getHubById,
  joinHub,
  leaveHub,
};
